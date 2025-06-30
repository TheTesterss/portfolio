import discord1 from './assets/images/discord1.png';
import discord2 from './assets/images/discord2.png';
import shell1 from './assets/images/shell1.png';
import shell2 from './assets/images/shell2.png';
import portfolio1 from './assets/images/portfolio1.png';
import portfolio2 from './assets/images/portfolio2.png';
import portfolio3 from './assets/images/portfolio3.png';
import portfolio4 from './assets/images/portfolio4.png';

export const PROJECTS_CONFIG = [
    {
        name: 'Portfolio (React TS + Tailwindcss)',
        category: 'web',
        githubLink: 'https://github.com/TheTesterss/portfolio-frontend-',
        images: [portfolio1, portfolio2, portfolio3, portfolio4],
        description: 'First version of my portfolio. See inside everything needed to know about me and my projects.'
    },
    {
        name: 'Interpreter V1 (Typescript)',
        category: 'interpreter',
        githubLink: 'https://github.com/TheTesterss/TEV',
        images: [],
        description:
            'First version of my own interpreter, abandoned means no future update. V2 out and much more optimized. This version still includes commands to start tev files and also features such as if, while, variables, conditions, default libraries (maths)...'
    },
    {
        name: 'Interpreter V2 (Typescript)',
        category: 'interpreter',
        githubLink: 'https://github.com/TheTesterss/CTFDBD',
        images: [],
        description:
            'Second version of my own interpreter, abandoned means no future update. V3 out and faster because made in golang. This version includes almost nothing excepts variables and print.'
    },
    {
        name: 'Interpreter V3 (Golang)',
        category: 'interpreter',
        githubLink: 'https://github.com/TheTesterss/memory',
        images: [],
        description:
            'Third version of my own interpreter, future updates in the next months including every needed features and why not commands to run files. Actuallay almost empty just a simple print function.'
    },
    {
        name: 'Apis REST (Typescript)',
        category: 'web',
        githubLink: 'https://github.com/TheTesterss/RestApis',
        images: [],
        description:
            'Simple rest apis to communicate with for some datas such as: movies informations, pokemons informations, discord user informations. Not updated for now, why not in the next year.'
    },
    {
        name: 'Discord Bot Handler (Typescript)',
        category: 'discord',
        githubLink: 'https://github.com/TheTesterss/Epsilon-DiscordBot',
        images: [discord1, discord2],
        description:
            'A complete discord bot handler which includes custom events, registred database, custom preconditions, a bot manager command and everything is optimized.'
    },
    {
        name: 'French verifications (Golang)',
        category: 'misc',
        githubLink: 'https://github.com/TheTesterss/isFrenchText',
        images: [],
        description:
            'A school project that I found interesting to put here because it was one of my first go project. The goal is to return the percentage of french words found in a text. Using some optimisation map to avoid looking for twice or more times the same word.'
    },
    {
        name: 'Shell (Go + ElectronJS + React TS + Tailwindcss',
        category: 'web',
        githubLink: 'https://github.com/TheTesterss/web-shell',
        images: [shell1, shell2],
        description:
            'An uncomplete shell which for now includes only "this history/clear" to manage the instance but also an echo command. New features are coming and why not auto completion.'
    }
];

export const USERNAME = 'TheTesters';
export const AUTHOR_NAME = 'Morgan Jaouen';

export const GUILD_ID = '1355918524970827846';
export const GUILD_URI = 'https://discord.gg/zzCDW6Nhsq';
export const GIT_USERNAME = 'TheTesterss';
