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
        githubLink: 'https://github.com/TheTesterss/portfolio',
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
            en: 'Started web development with online tutorials. Mainly learned HTML and what can be done with it by following sites and tutorials from w3school, openclassroom and grafikart.',
            fr: "Je commence le développement web avec des tutoriels en ligne. J'ai appris principalement le HTML et ce qu'on peut faire avec en suivant des sites et tutoriels de w3school, openclassroom et grafikart."
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
            en: 'To continue with HTML, I learnt CSS and applied it more deeply. Now I turn to technologies like tailwind and bootstrap to simplify things.',
            fr: "Pour continuer dans la lancée du HTML, j'ai appris le CSS et l'est appliqué plus en profondeur. Puis désormais je me tourne vers des technologies comme tailwind et bootstrap pour simplifier."
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
            en: 'After HTML and CSS, I learned Javascript to add animations. Creating my first web project for school which was quite atypical. I learned how to manage html and css in Javascript, adding various elements to html, modifying css environment variables for dark themes.',
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
            en: 'Using rest apis for months was nice but learning how to make some was better. Using express to create some to return images or json datas, adding filters... Learning Typescript allowed me to be more precise mainly for big projects.',
            fr: "Utilisant les apis rest pendant des mois était sympa mais apprendre comment en faire était meilleur. En utilisant express pour en créer pour renvoyer images ou données JSON, ajouter des filtres... Apprendre Typescript m'a permis d'être plus précis principalement pour de gros projets."
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
            en: 'A video game fan since my childhood especially minecraft with which I grew up. So I learned JAVA to develop plugins and mods. I did not like developing with it notably the fact of creating my textures etc... So I stopped after a few small projects.',
            fr: "Fan de jeux vidéos depuis mon enfance notamment minecraft avec lequel j'ai grandit. J'ai donc appris le JAVA pour développer plugins et mods. Je n'aimais pas développer avec notamment le fait de créer mes textures etc... J'ai donc arrêté après quelques petits projets."
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
            en: "I started the last two years of high school. I took my specialities for the Baccalaureate: mathematics, economic and social sciences as well as digital and computer science. The digital was relevant for the theory although in practice I knew how to reproduce almost all the programs, I learned algorithms, complexities, how a computer works...",
            fr: "J'ai commencé les deux dernières années de lycée. J'ai pris mes spécialités pour le Baccaulauréat: mathématiques, sciences économiques et sociales ainsi que numérique et sciences informatiques. Le numérique était pertinant pour la théorie bien qu'en pratique je savais reproduire la quasi totalité des programmes, j'ai appris des algorithmes, les complexités, comment marche un ordinateur..."
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
            en: 'Last year of high school. The theory is still as interesting. I learned new things such as sql (I only knew mongodb), graph and tree theory that I had already used in practice without knowing the theory.',
            fr: "Dernière année de lycée. La théorie est toujours aussi intéréssante. J'ai appris de nouvelles choses comme le sql (je connaissais uniquement mongodb), la théorie des graphes et arbres que j'avais déjà utilisé en pratique sans en savoir la théorie."
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
            en: 'I started learning go since C++ was the second choice and I did not like it that much. In go there is still memory management and a lot of pointers. I learned some algorithms.',
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
