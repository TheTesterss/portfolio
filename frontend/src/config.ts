import discord1 from './assets/images/discord1.png';
import discord2 from './assets/images/discord2.png';
import shell1 from './assets/images/shell1.png';
import shell2 from './assets/images/shell2.png';
import portfolio1 from './assets/images/portfolio1.png';
import portfolio2 from './assets/images/portfolio2.png';
import portfolio3 from './assets/images/portfolio3.png';
import portfolio4 from './assets/images/portfolio4.png';
import interpreter1V3 from './assets/images/interpreter1V3.png';
import interpreter2V3 from './assets/images/interpreter2V3.png';

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
        images: [interpreter1V3, interpreter2V3],
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

export const timelineData = [
    {
        date: 'Juin 2021',
        title: {
            fr: 'Début du code',
            en: 'Start of coding'
        },
        color: 'red-500',
        description: {
            en: 'Starting programming with the web and online tutorials. I mostly learnt HTML and what we can do with following sites comme w3school, openclassroom or grafikart.',
            fr: "Je débute le code avec le web et les tutoriels en ligne. J'apprend en grande partie le HTML avec ce qu'on peut y faire en suivant des sites comme w3shool, openclassroom ou grafikart."
        }
    },
    {
        date: 'Juillet 2021',
        title: {
            fr: 'Approfondissement',
            en: 'Deepening'
        },
        color: 'green-500',
        description: {
            en: 'Continued my progression by learning CSS almost required to make beautiful websites. I, in the future continued to learn styling with bootstrap or tailwind.',
            fr: "J'ai continué ma progression en apprennant CSS quasiment demandé pour faire d'assez beau sites. J'ai, par la suite appris d'autres frameworks pour styliser avec bootstrap ou tailwind."
        }
    },
    {
        date: 'Octobre 2021',
        title: {
            fr: 'Complétion des compétences web',
            en: 'Web skills completion'
        },
        color: 'cyan-500',
        description: {
            en: 'After HTML and CSS, I learnt Javascript to add animation. Making my first web project for school which was very atypic. I learnt how we can manage css and html in javascript, adding new elements to html, updating css environments variables for dark/white modes...',
            fr: "Après HTML et CSS, j'ai appris Javascript pour ajouter des animations. Créant mon premier projet web pour les cours qui fût assez atypique. J'ai appris comment gérer html et css en Javascript, ajoutant divers éléments au html, modifiant les variables d'environnements css pour des thèmes sombres."
        }
    },
    {
        date: 'Mars 2022',
        title: {
            fr: 'Le vrai code',
            en: 'Real coding'
        },
        color: 'magenta-500',
        description: {
            en: 'I started real code, outside my domain which was web. I started learning Node.js mainly for discord bot learning how to use websocket apis and rest apis. Interfaces were way more easy to create games...',
            fr: "J'ai commencé le vrai code, en dehors de mon domaine qui était le web. J'ai appris Node.js principalement pour les bots discord, apprenant l'usage d'apis rest et websocket. Les interfaces étaient simples pour les jeux..."
        }
    },
    {
        date: 'Décembre 2022',
        title: {
            fr: 'Le backend + Typescript',
            en: 'Backend + Typescript'
        },
        color: 'blue-500',
        description: {
            en: 'Using rest apis for month was cool but learning how to make mine was far better. Using express to create apis to return JSON datas or images, adding filters... was amazing. Typescript allowed me to be more precise mainly for huge projects.',
            fr: "Utilisant les apis rest pendant des mois était cool mais apprendre comment en faire était meilleur. En utilisant express pour en créer pour renvoyer images ou données JSON, ajouter des filtres... était incroyable. Typescript m'a permis d'être plus précis principalement pour de gros projets."
        }
    },
    {
        date: 'Mars 2023',
        title: {
            fr: 'Un nouveau langage',
            en: 'A new language'
        },
        color: 'pink-500',
        description: {
            en: 'Fan of gaming since my childhood, I learned minecraft api which required knowledge in Java a weird and dirty language (for me). I disliked the way to manage my minecraft even if it was useful so I stopped months after.',
            fr: "Fan de gaming depuis mon enfance, J'ai appris l'api de minecraft qui demandait des connaissances en Java, un étrange et sale langage (pour moi). Je n'ai pas apprécié la façon de gérer mon minecraft même si c'était utile du coup j'ai arrêté quelques mois après."
        }
    },
    {
        date: 'Septembre 2023',
        title: {
            fr: 'Rentrée en première',
            en: 'Start of penultimate year'
        },
        color: 'orange-500',
        description: {
            en: "I went to being two classes of college's end. I got numeric speciality which was very interessant for the theories. Learning binary, assembly, python (which I already knew well), images manipulation, python interfaces... I had a way better level that what was required in pratic but theory was for real one thing I needed to understand.",
            fr: "J'ai été à 2 classes de la fin du lycée. J'ai pris la spécialité numérique qui était vraiment intéressante pour les théories. Apprenant le binaire, assembleur, python (que je connaissais déjà bien), la manipulation d'images, les interfaces en python... J'avais un bien meilleur niveau que demandé en pratique mais pour la théorie c'était réellement quelque chose dont j'avais besoin."
        }
    },
    {
        date: 'Septembre 2024',
        title: {
            fr: 'Rentrée en terminale',
            en: 'Start of final year'
        },
        color: 'gray-300',
        description: {
            en: 'Very last year of college. Same as for the last year, theories were incredible. Learnt graphs, database (sql, I personally knew mongodb), trees... I already used these notions in pratic but never applicated them with the complete theory.',
            fr: "Dernière année de lycée. Pareil que l'année précédante, les théories étaient incroyable. J'ai appris les graphes, les bases de données (sql, je connaissais déjà mongodb), les arbres... J'utilisais déjà les notions en pratique mais je ne les avais jamais appliqué avec la théorie complète."
        }
    },
    {
        date: 'Novembre 2024',
        title: {
            fr: 'Go + Algorithme',
            en: 'Go + Algorithm'
        },
        color: 'cyan-500',
        description: {
            en: 'I started learning go as C++ was the other choice and I disliked it. In go I still have some memory managment but lot of pointing. Learnt few basic algorithms.',
            fr: "J'ai commencé à apprendre le go puisque C++ était le second choix et je l'aimais pas tant. En go il y a toujours de la gestion de la mémoire et beaucoup de pointages. J'ai appris quelques algorithmes."
        }
    },
    {
        date: 'Janvier 2025',
        title: {
            fr: 'React + TailwindCSS',
            en: 'React + TailwindCSS'
        },
        color: 'blue-500',
        description: {
            en: 'Came back to making sites, I learnt a new technology to make site conception easier and better. I learnt react for the simplicity and the presence everything allowing me to ask for help to lot of people. Tailwind is easy so I used it as it was present everywhere.',
            fr: "De retour pour faire des sites, j'ai appris de nouvelles technologies pour la conception de sites, les rendants faciles et meilleurs. J'ai appris react pour sa simplicité et sa présence partout m'aidant pour demander de l'aide. Tailwind est facile, je l'ai donc utilisé puisqu'il est présent partout."
        }
    },
    {
        date: 'Juin 2025',
        title: {
            fr: 'Approfondissement',
            en: 'Deepening'
        },
        color: 'yellow-500',
        description: {
            en: 'Starting code daily, started project and continued them such as a shell, my portfolio, my own interpreter.',
            fr: "J'ai commencé le code quotidiennement, commençant des projets et continuant certains tels qu'un shell, un portfolio, un interpréteur."
        }
    }
];

export const USERNAME = 'TheTesters';
export const AUTHOR_NAME = 'Morgan Jaouen';

export const GUILD_ID = '1355918524970827846';
export const GUILD_URI = 'https://discord.gg/zzCDW6Nhsq';
export const GIT_USERNAME = 'TheTesterss';
