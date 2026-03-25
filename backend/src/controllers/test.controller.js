const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const { execFile } = require('child_process');

const runCommand = (command, args, options) =>
    new Promise((resolve, reject) => {
        execFile(command, args, options, (error, stdout, stderr) => {
            if (error) {
                reject({
                    ...error,
                    stdout,
                    stderr
                });
                return;
            }

            resolve({ stdout, stderr });
        });
    });

const removeDirectory = async (directoryPath) => {
    if (!directoryPath) {
        return;
    }

    await fs.promises.rm(directoryPath, { recursive: true, force: true });
};

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

const normalizeObject = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value;
};

const buildUrl = (baseUrl, route, params) => {
    const normalizedBaseUrl = typeof baseUrl === 'string' ? baseUrl.trim() : '';
    const normalizedRoute = typeof route === 'string' ? route.trim() : '';

    if (!normalizedBaseUrl) {
        throw new Error('Missing base URL.');
    }

    if (!normalizedRoute) {
        throw new Error('Missing route.');
    }

    const hydratedRoute = normalizedRoute.replace(/:([a-zA-Z0-9_]+)|\{([a-zA-Z0-9_]+)\}/g, (_, colonKey, bracketKey) => {
        const key = colonKey || bracketKey;
        const value = params[key];

        if (value === undefined || value === null || value === '') {
            throw new Error(`Missing value for route parameter "${key}".`);
        }

        return encodeURIComponent(String(value));
    });

    return new URL(hydratedRoute, normalizedBaseUrl).toString();
};

exports.runMemoryInterpreter = async (req, res) => {
    const code = typeof req.body?.code === 'string' ? req.body.code : '';
    const interpreterPath = process.env.MEMORY_INTERPRETER_PATH;

    if (!code.trim()) {
        return res.status(400).json({ message: 'Missing code to execute.' });
    }

    if (!interpreterPath) {
        return res.status(500).json({
            message: 'MEMORY_INTERPRETER_PATH is not configured on the backend.'
        });
    }

    if (!fs.existsSync(interpreterPath) || !fs.existsSync(path.join(interpreterPath, 'go.mod'))) {
        return res.status(500).json({
            message: 'MEMORY_INTERPRETER_PATH must point to the memory interpreter repository.'
        });
    }

    let temporaryDirectory = '';

    try {
        temporaryDirectory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'memory-run-'));
        const runnerDirectory = path.join(temporaryDirectory, 'memory');

        await fs.promises.cp(interpreterPath, runnerDirectory, { recursive: true });
        await fs.promises.writeFile(path.join(runnerDirectory, 'test.ru'), code, 'utf8');

        const { stdout, stderr } = await runCommand('go', ['run', '.'], {
            cwd: runnerDirectory,
            timeout: 15000,
            maxBuffer: 1024 * 1024
        });

        return res.json({
            stdout: stdout.trimEnd(),
            stderr: stderr.trimEnd(),
            exitCode: 0
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(500).json({
                message: 'Go is not installed or is not available in PATH on the backend.'
            });
        }

        return res.status(200).json({
            stdout: (error.stdout || '').trimEnd(),
            stderr: (error.stderr || error.message || '').trimEnd(),
            exitCode: typeof error.code === 'number' ? error.code : 1
        });
    } finally {
        await removeDirectory(temporaryDirectory);
    }
};

exports.runHttpRequest = async (req, res) => {
    const method = typeof req.body?.method === 'string' ? req.body.method.toUpperCase() : 'GET';
    const params = normalizeObject(req.body?.params);
    const query = normalizeObject(req.body?.query);

    if (!ALLOWED_METHODS.has(method)) {
        return res.status(400).json({
            message: 'Unsupported HTTP method.'
        });
    }

    let url = '';

    try {
        url = buildUrl(req.body?.baseUrl, req.body?.route, params);
    } catch (error) {
        return res.status(400).json({
            message: error.message || 'Invalid request configuration.'
        });
    }

    try {
        const response = await axios({
            method: method.toLowerCase(),
            url,
            params: query,
            data: method === 'GET' ? undefined : req.body?.body,
            validateStatus: () => true
        });

        return res.json({
            method,
            url: response.request?.res?.responseUrl || url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
    } catch (error) {
        return res.status(502).json({
            message: error.message || 'Unable to execute upstream HTTP request.'
        });
    }
};
