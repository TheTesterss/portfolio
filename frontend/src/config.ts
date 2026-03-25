import discord1 from './assets/images/discord1.png';
import discord2 from './assets/images/discord2.png';
import portfolio1 from './assets/images/portfolio1.png';
import portfolio2 from './assets/images/portfolio2.png';
import portfolio3 from './assets/images/portfolio3.png';
import portfolio4 from './assets/images/portfolio4.png';
import interpreter1V3 from './assets/images/interpreter1V3.png';
import interpreter2V3 from './assets/images/interpreter2V3.png';

export interface MemoryInterpreterTestConfig {
    type: 'memory_interpreter';
    title: string;
    title_fr: string;
    endpoint: string;
    initialCode: string;
    initialCode_fr?: string;
}

export interface ApiRequestTestConfig {
    type: 'api_request';
    title: string;
    title_fr: string;
    endpoint: string;
    baseUrl: string;
    initialMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    initialRoute: string;
    initialParams?: string;
    initialQueries?: string;
    initialBody?: string;
}

export interface ExternalLinkTestConfig {
    type: 'external_link';
    title: string;
    title_fr: string;
    url: string;
    buttonLabel: string;
    buttonLabel_fr: string;
}

export type ProjectTestConfig = MemoryInterpreterTestConfig | ApiRequestTestConfig | ExternalLinkTestConfig;

export interface ProjectConfig {
    name: string;
    category: string;
    githubLink: string;
    images: string[];
    description: string;
    description_fr: string;
    tests?: ProjectTestConfig[];
}

// &&&&&&   = split to add images depending on the counting of those.
// §text§   = to make a text like `text` in markdown.
// §§§§§§   = to start a block of code but also ends one. The first text can be used to add colours syntaxes like §§§§§§go for go syntax highlighting.
// #text    = titles.
// $text$   = to make a chapter.
// *text    = to make a text in italic.
// %number% = to add blank spaces.
// ^^^^^^   = to make clickable section.
// ::::::   = to make sections.
export const PROJECTS_CONFIG: ProjectConfig[] = [
    {
        name: 'Portfolio (React TS + Tailwindcss)',
        category: 'web',
        githubLink: 'https://github.com/TheTesterss/portfolio',
        images: [portfolio1, portfolio2, portfolio3, portfolio4],
        description: `
        $Presentation$
        §Portfolio you're currently on!§

        Portfolio is split in different sections explained on the naviguation:
            - §About me§ - §Skills§ - §Projects§ - §Contact§ -
        
        $About me$
        ::::::
        ### About me
        ::::::
        First part explains using a basic description of myself at the moment, in the past and what I hope in the future using timelime!
        &&&&&&
        $Skills$
        ::::::
        ### Skills
        ::::::
        Second part explains my skills:
            - §beginner§    = Just started using it for one of my first times. Pretty bad at using it.
            - §intermediate§ = I already have used it much times. Learnt all the basics stuffs and sometimes more but need to fill vacant knowledge.
            - §advanced§     = Already used it lot of times even not mentionned here. Can learn by myself all the stuff I don't know when I will need them but can do a large amount of coding projects with my current level.
            - §expert§       = Knows all the basics and even more. Don't have to read documentations and ability to even lot of the times just look up the source code by myself to see a stuff I was looking for.  
        &&&&&&
        $Projects$
        ::::::
        ### Projects
        ::::::
        Third part deals with the most important part in my opinion: the projects. It adds documentation (different from the README.md) for each project but that's not all:
            - §todos§        = The corrections given to the project but also the next updates coming and what they may add.
            - §changelogs§   = Wrote explainations about all the added stuffs through the updates and the whole is versionned.
            - §informations§ = Documented but understandable for everyone to understand: the project itself, what it does and how it does it.
            - §tests§     = Tests (if available for the project) to try by yourself without having to leave the page, some different projects!
        &&&&&&
        &&&&&&
        `,
        description_fr: `
        $Presentation$
        §Le portfolio sur lequel vous êtes!§

        Le portolio se divise en différentes sections expliquées dans la navigation:
            - §A propos de moi§ - §Compétences§ - §Projets§ - §Contact§ -
        
        $A propos de moi$
        ::::::
        ### A propos de moi
        ::::::
        La première partie explique en utilisant des descriptions simplistes de moi actuellement, dans le passé et de ce que j'espère dans le futur en utilisant une frise chronologique !
        &&&&&&
        $Compétences$
        ::::::
        ### Compétences
        ::::::
        La seconde partie explique mes compétences:
            - §débutant§      = Simplement commencé à l'utilisé pour l'une de mes premières fois. Assez nul à l'utilisation.
            - §intermédiaire§ = J'ai déjà utilisé quelques fois. Appris les fonctionnalités basiques et plus des fois mais un manque de connaissances à remplir.
            - §avancé§        = Déjà utilisé à maintes reprises même sans être mentionné ici. Peux apprendre par moi même ce qu'il me manque assez aisément quand j'en aurai besoin et peut créer un bon nombre de projets de programmation avec mon niveau actuel.
            - §expert§        = Connais tous les basiques et plus. N'a pas besoin de lire les documentations et ai la possibilité de lire le code source par moi même pour trouver des fonctionnalités que je recherchais.
        &&&&&&
        $Projets$
        ::::::
        ### Projets
        ::::::
        La troisième partie traite du plus important selon moi: les projets. Il ajoute de la documentation (différente des README.md) pour chaque projet mais ce n'est pas tout:
            - §à faire§           = Les corrections faîtes au projet mais aussi les futures mises à jours qui arrivent et ceux quelles ajoutent.
            - §logs mises à jour§ = Explications écrites à propos de toutes les fonctionnalités ajoutées au cours des mises à jours et versionnées.
            - §informations§      = Documenté mais compréhensible pour tous pour comprendre: le projet en lui même, ce qu'il fait et comment il le fait.
            - §tests§             = Tests (si disponible pour le projet) pour essayer par vous mêmes sans avoir à quitter la page, différents projets.
        &&&&&&
        &&&&&&
        `
    },
    {
        name: 'Interpreter V1 (Typescript)',
        category: 'interpreter',
        githubLink: 'https://github.com/TheTesterss/interpreter-v1',
        images: [],
        description: `
        First version of my own interpreter. Make it very simple and didn\'t went further as the optimization was really bad. I started learning more about algorithms and implementations. I also came more prepared for the result coherence and organization.
        
        No screen.`,
        description_fr: `
        Première version de mon propre interpréteur. Je l'ai fait très simple et je ne suis pas allé plus loin car l'optimisation était vraiment mauvaise. J'ai commencé à apprendre davantage sur les algorithmes et les implémentations. Je suis également venu plus préparé pour la cohérence des résultats et l'organisation.
        
        Pas de screen.`
    },
    {
        name: 'Interpreter Version 2 (Golang)',
        category: 'interpreter',
        githubLink: 'https://github.com/TheTesterss/interpreter-v2',
        images: [interpreter2V3, interpreter1V3],
        tests: [
            {
                type: 'memory_interpreter',
                title: 'Try out the interpreter',
                title_fr: 'Essayez l\'interpréteur',
                endpoint: '/api/tests/memory/run',
                initialCode: `
setVar["i";0;"int"]
while[i<=10]
    setVar["j";0;"int"]
    while[j<=10]
        if[(j*i)%2==0]
            print["j*i is even: {j*i}"]
        else[]
            print["j*i is odd: {j*i}"]
        end[]
        setVar["j";j+1]
    end[]
    setVar["i";i+1]
end[]
                `,
                initialCode_fr: `
setVar["i";0;"int"]
while[i<=10]
    setVar["j";0;"int"]
    while[j<=10]
        if[(j*i)%2==0]
            print["j*i is even: {j*i}"]
        else[]
            print["j*i is odd: {j*i}"]
        end[]
        setVar["j";j+1]
    end[]
    setVar["i";i+1]
end[]
                `
            }
        ],
        description: `
        $Presentation$
        Second version of my own interpreter. I make it in go for the fun of learning a new language and also to have more control over the memory managment. Go is also my first compiled language. Made it so it does run with all those features:
            - §variables§    = variables with different types. They are mutable and are saved through a map such as python does.
            - §conditions§   = if/else conditions to make the code more dynamic and usable. Priorities are the same with §&& > || > !§
            - §loops§        = while loops only as for loops are just while loops with a variable initialization and update. 
            - §calculus§     = basic calculus with operands and parenthesis.
        All the blocks are stacked in a stack so when you call §end[]§ it ends the last opened block.
        
        $Basics$
        ::::::
        ### Basics
        ::::::
        *Commentaries will be writer like: §c[ commentary ]§.

        Calling and setting a variable: ^^^^^^
            §§§§§§custom
            setVar["x";5;"int"] c[ it does sets the type as "int" ]
            
            setVar["y";5+x;"int"] c[ it does compute y as 5 + x which is 10 ]
            §§§§§§
        ^^^^^^
        
        *Valid types:
            - §int§
            - §string§
            - §bool§
            - §nil§
            - §any§ (accepts all types but no operations can be done with it as it does not know the type)

        IO: ^^^^^^
            §§§§§§custom
            print["x"]
            print[5+1]
            
            setVar["x";5] c[ any type put]
            print["content of x is {x}"] c[ it does print content of x is 5 with escaping ]
            §§§§§§
        ^^^^^^

        $Blocks$
        ::::::
        ### Blocks
        ::::::
        Conditions and if/else blocks: ^^^^^^
            §§§§§§custom
            print[2 > 1 && 3 > 2] c[ it does print true ]

            setVar["x";5]
            if[x > 3] c[ it does print x is superior to 3 ]
                print["true condition"]
            else[]
                print["false condition"]
            end[]

            c[ elseif is also available as end[] closes so else[] if[] would break or request a second end[] ]
            if[x = 2] 
                print["x is 2"]
            elseif[x > 2] c [ it does print x is superior to 2 ]
                print["x is greater than 2"]
            else[]
                print["x is less than 2"]
            end[]
            §§§§§§
        ^^^^^^

        Loops: ^^^^^^
            §§§§§§custom
            setVar["x";0]
            while[x < 5]
                print["x is {x}"] c[ it does print x is 0 then 1 then 2 then 3 then 4 ]
                setVar["x";x+1]
            end[]
            §§§§§§
        ^^^^^^

        $Examples$
        ::::::
        ### Examples
        ::::::
        These final screens show result of a small codes which includes all the features. ^^^^^^
        §§§§§§custom
            setVar["i";0;"int"]
            while[i<=10]
                setVar["j";0;"int"]
                while[j<=10]
                    if[(j*i) % 2 == 0]
                        print["j*i is even: {j*i}"]
                    else[]
                        print["j*i is odd: {j*i}"]
                    end[]
                    setVar["j";j+1;"int"]
                end[]
                setVar["i";i+1;"int"]
            end[]
        §§§§§§
        &&&&&&
        &&&&&&
        ^^^^^^
        %7%
        `,
        description_fr: `
        $Présentation$
        Seconde version de mon propre interpréteur. Je l'ai fait en go pour le plaisir d'apprendre un nouveau langage et aussi pour avoir plus de contrôle sur la gestion de la mémoire. Go est aussi mon premier langage compilé. Je l'ai fait pour qu'il puisse fonctionner avec toutes ces fonctionnalités:
            - §variables§    = variables avec différents types. Elles sont mutables et sont sauvegardées à travers une map comme le fait python.
            - §conditions§   = conditions if/else pour rendre le code plus dynamique et utilisable. Les priorités sont les mêmes avec §&& > || > !§
            - §boucles§      = boucles while seulement car les for ne sont que des while avec une initialisation et une mise à jour de variable.
            - §calculs§      = calculs basiques avec opérateurs et parenthèses.
        Tous les blocs sont empilés dans une pile donc quand vous appelez §end[]§ cela termine le dernier bloc ouvert.

        $Bases$
        ::::::
        ### Bases
        ::::::
        *Les commentaires seront écrits comme: §c[ commentaire ]§.

        Appeler et définir une variable: ^^^^^^
            §§§§§§custom
            setVar["x";5;"int"] c[ cela définit le type comme "int" ]
            setVar["y";5+x;"int"] c[ cela calcule y comme 5 + x qui est 10 ]
            §§§§§§
        ^^^^^^

        *Types valides:
            - §int§
            - §string§
            - §bool§
            - §nil§
            - §any§ (accepte tous les types mais aucune opération ne peut être faite avec lui car il ne connaît pas le type)
        
        IO: ^^^^^^
            §§§§§§custom
            print["x"]
            print[5+1]
            setVar["x";5] c[ n'importe quel type mis]
            print["content of x is {x}"] c[ cela affiche content of x is 5 avec de l'escaping ]
            §§§§§§
        ^^^^^^

        $Blocs$
        ::::::
        ### Blocs
        ::::::
        Conditions et blocs if/else: ^^^^^^
            §§§§§§custom
            print[2 > 1 && 3 > 2] c[ cela affiche true ]

            setVar["x";5]
            if[x > 3] c[ cela affiche x is superior to 3 ]
                print["true condition"]
            else[]  
                print["false condition"]
            end[]

            c[ elseif est aussi disponible car end[] ferme donc else[] if[] casserait ou demanderait un second end[] ]
            if[x = 2]
                print["x is 2"]
            elseif[x > 2] c [ cela affiche x is superior to 2 ]
                print["x is greater than 2"]
            else[]
                print["x is less than 2"]
            end[]
            §§§§§§
        ^^^^^^

        Boucles: ^^^^^^
            §§§§§§custom
            setVar["x";0]
            while[x < 5]
                print["x is {x}"] c[ cela affiche x is 0 puis 1 puis 2 puis 3 puis 4 ]
                setVar["x";x+1]
            end[]
            §§§§§§
        Boucles: ^^^^^^
        
        
        $Exemples$
        ::::::
        ### Exemples
        ::::::
        Ces screens final montre le résultat d'un petit code qui inclut toutes les fonctionnalités. ^^^^^^
        §§§§§§custom
            setVar["i";0;"int"]
            while[i<=10]
                setVar["j";0;"int"]
                while[j<=10]
                    if[(j*i) % 2 == 0]
                        print["j*i is even: {j*i}"]
                    else[]
                        print["j*i is odd: {j*i}"]
                    end[]
                    setVar["j";j+1;"int"]
                end[]
                setVar["i";i+1;"int"]
            end[]
        §§§§§§
        &&&&&&
        &&&&&&
        ^^^^^^
        %7%
        `
    },
    {
        name: 'Apis REST (Typescript)',
        category: 'web',
        githubLink: 'https://github.com/TheTesterss/misc-apis',
        images: [],
        tests: [
            {
                type: 'api_request',
                title: 'Pokemon Detail API',
                title_fr: 'API Detail Pokemon',
                endpoint: '/api/tests/http/request',
                baseUrl: 'http://localhost:8080',
                initialMethod: 'GET',
                initialRoute: '/pokemons/:pokemon',
                initialParams: `pokemon: pikachu`,
                initialQueries: ``,
                initialBody: `{}`
            },
            {
                type: 'api_request',
                title: 'Pokemon List API',
                title_fr: 'API Liste Pokemon',
                endpoint: '/api/tests/http/request',
                baseUrl: 'http://localhost:8080',
                initialMethod: 'GET',
                initialRoute: '/pokemons',
                initialParams: ``,
                initialQueries: `type1: fire
gen: 1`,
                initialBody: `{}`
            },
            {
                type: 'api_request',
                title: 'Movies List API',
                title_fr: 'API Liste Films',
                endpoint: '/api/tests/http/request',
                baseUrl: 'http://localhost:8080',
                initialMethod: 'GET',
                initialRoute: '/movies',
                initialParams: ``,
                initialQueries: `director: Christopher Nolan
sortBy: revenue
order: desc
limit: 5`,
                initialBody: `{}`
            },
            {
                type: 'api_request',
                title: 'Movie Detail API',
                title_fr: 'API Detail Film',
                endpoint: '/api/tests/http/request',
                baseUrl: 'http://localhost:8080',
                initialMethod: 'GET',
                initialRoute: '/movies/:movie',
                initialParams: `movie: Harry Potter`,
                initialQueries: ``,
                initialBody: `{}`
            }
        ],
        description: `
        $Presentation$
        REST APIs built in Typescript around curated Pokemon and movie datasets.

        The project focuses on three important parts:
            - §data§             = typed datasets and query inputs designed to make the routes easy to use.
            - §algorithms§       = filtering, sorting... to expose useful data without needing a database.
            - §api design§       = simple routes with typed queries so the project stays readable, testable and easy to extend.

        $Dataset and types$
        ::::::
        ### Dataset and types
        ::::::
        Pokemon data is now loaded from CSV and typed from the file keys themselves. Important fields include:
            - §name / namefr§
            - §type1 / type1fr / type2/none / type2fr/none§
            - §generation§
            - §index§

        Movies are also loaded from CSV with typed numeric fields such as:
        Interfaces example: ^^^^^^
            §§§§§§typescript
            interface PokemonInterface {
                name: string;
                namefr: string;
                type1: string;
                type1fr: string;
                'type2/none': string | null;
                generation: number;
                index: number;
            }

            interface MovieInterface {
                id: number;
                title: string;
                original_title: string;
                original_language: string;
                revenue: number;
                popularity: number;
                vote_average: number;
                director: string | null;
            }
            §§§§§§
        ^^^^^^
            - §revenue§
            - §popularity§
            - §vote_average§
            - §runtime§
            - §original_language§

        $Algorithms$
        ::::::
        ### Algorithms
        ::::::
        The movie routes rely on sorting and fuzzy matching:
            - §sorting§           = list results can be sorted by revenue, popularity or vote average.
            - §fuzzy search§      = the movie detail route first tries exact normalization, then substring matching, then token overlap and finally Levenshtein distance.
            - §response cleanup§  = heavy fields like §crew§ are removed from API responses to keep results smaller and clearer.

        Pokemon routes rely on filtering:
            - §type filters§      = filter on primary and secondary types in French or English.
            - §generation filter§ = filter by generation number.

        Search pipeline: ^^^^^^
            §§§§§§typescript
            const exactMatch = movies.find((movie) =>
                compactMovieText(movie.title) === normalizedMovie ||
                compactMovieText(movie.original_title) === normalizedMovie
            );

            const containingMatches = movies.filter((movie) =>
                compactMovieText(movie.title).includes(normalizedMovie)
            );

            const distance = levenshteinDistance(normalizedMovie, compactMovieText(movie.title));
            §§§§§§
        ^^^^^^

        Optimizations: ^^^^^^
            - CSV datasets are cached in memory after the first load to avoid reparsing files on each request.
            - numeric and boolean values are converted once when the CSV is read.
            - movie responses are sanitized before sending to avoid heavy payloads.
        ^^^^^^

        $Queries and tests$
        ::::::
        ### Queries and tests
        ::::::
        Allowed queries are typed and intentionally small:
            - §/pokemons§ = §type1: string§, §type2: string | "NONE"§, §gen: number§
            - §/movies§   = §title: string§, §director: string§, §language: string§, §minRevenue: number§, §maxRevenue: number§, §sortBy: "revenue" | "popularity" | "vote_average"§, §order: "asc" | "desc"§, §limit: number§

        The portfolio includes request panels for this project. You can choose:
            - HTTP method
            - route
            - params with a §key: value§ syntax
            - queries with a §key: value§ syntax
            - JSON body for non-GET requests

        Test examples: ^^^^^^
            §§§§§§typescript
            GET /pokemons/:pokemon
            pokemon: pikachu
            gen: 1

            GET /movies
            director: Christopher Nolan
            sortBy: revenue
            order: desc
            limit: 5
            §§§§§§
        ^^^^^^

        Each test shows a colorized preview and the returned payload directly in the portfolio.

        `,
        description_fr: `
        $Presentation$
        APIs REST faites en Typescript autour des donnees pokemons et films.

        Le projet met surtout en avant trois points:
            - §modélisation des donnees§ = datasets types et queries typées pour garder des routes lisibles.
            - §algorithmes§              = pour filtrer, trier... sans besoin de base de données
            - §design API§               = endpoints simples à comprendre et à faire évoluer.

        $Datasets et types$
        ::::::
        ### Datasets et types
        ::::::
        Les Pokemon sont maintenant charges depuis un CSV et types a partir des cles du fichier. Les champs importants sont:
            - §name / namefr§
            - §type1 / type1fr / type2/none / type2fr/none§
            - §generation§
            - §index§

        Les films sont eux aussi charges depuis un CSV avec des champs numeriques types comme:
        Exemple d'interfaces: ^^^^^^
            §§§§§§typescript
            interface PokemonInterface {
                name: string;
                namefr: string;
                type1: string;
                type1fr: string;
                'type2/none': string | null;
                generation: number;
                index: number;
            }

            interface MovieInterface {
                id: number;
                title: string;
                original_title: string;
                original_language: string;
                revenue: number;
                popularity: number;
                vote_average: number;
                director: string | null;
            }
            §§§§§§
        ^^^^^^
            - §revenue§
            - §popularity§
            - §vote_average§
            - §runtime§
            - §original_language§

        $Algorithmes$
        ::::::
        ### Algorithmes
        ::::::
        Les routes pour les films reposent sur plusieurs algorithmes:
            - §tri§                   = tri par revenu, popularite ou note moyenne.
            - §recherche approchante§ = la route detail d'un film tente d'abord une normalisation exacte, puis une inclusion, puis un score par tokens communs et enfin une distance de Levenshtein.
            - §nettoyage de reponse§  = des champs lourds comme §crew§ sont retires pour alleger les resultats.

        Les routes Pokemon reposent surtout sur le filtrage:
            - §filtres de type§      = type principal et secondaire en francais ou en anglais.
            - §filtre de generation§ = numero de generation.

        Pipeline de recherche: ^^^^^^
            §§§§§§typescript
            const exactMatch = movies.find((movie) =>
                compactMovieText(movie.title) === normalizedMovie ||
                compactMovieText(movie.original_title) === normalizedMovie
            );

            const containingMatches = movies.filter((movie) =>
                compactMovieText(movie.title).includes(normalizedMovie)
            );

            const distance = levenshteinDistance(normalizedMovie, compactMovieText(movie.title));
            §§§§§§
        ^^^^^^

        Optimisations: ^^^^^^
            - les datasets CSV sont gardes en cache en memoire après le premier chargement.
            - les valeurs numériques et booléennes sont converties une seule fois a la lecture.
            - les réponses des films sont nettoyées avant envoi pour eviter des payloads trop lourds.
        ^^^^^^

        $Queries et tests$
        ::::::
        ### Queries et tests
        ::::::
        Les queries autorisées sont typées et volontairement simples:
            - §/pokemons§ = §type1: string§, §type2: string | "NONE"§, §gen: number§
            - §/movies§   = §title: string§, §director: string§, §language: string§, §minRevenue: number§, §maxRevenue: number§, §sortBy: "revenue" | "popularity" | "vote_average"§, §order: "asc" | "desc"§, §limit: number§

        Le portfolio inclut des panneaux de test pour ce projet. On peut choisir:
            - la methode HTTP
            - la route
            - les paramètres
            - les queries
            - un body JSON pour les requêtes hors GET

        Exemples de tests: ^^^^^^
            §§§§§§typescript
            GET /pokemons/:pokemon
            pokemon: pikachu
            gen: 1

            GET /movies
            director: Christopher Nolan
            sortBy: revenue
            order: desc
            limit: 5
            §§§§§§
        ^^^^^^

        Chaque test montre un aperçu colore et la réponse renvoyée directement dans le portfolio.
        `
    },
    {
        name: 'Discord Bot Handler (Typescript)',
        category: 'discord',
        githubLink: 'https://github.com/TheTesterss/discord-bot-ts',
        images: [discord1, discord2],
        tests: [
            {
                type: 'external_link',
                title: 'Invite the bot',
                title_fr: 'Inviter le bot',
                url: 'https://discord.com/oauth2/authorize?client_id=1486376884869533757',
                buttonLabel: 'Open Discord invite',
                buttonLabel_fr: "Ouvrir l'invitation Discord"
            }
        ],
        description: `
        $Presentation$
        A Discord bot handler written in Typescript with Discord.js and MongoDB.

        This project focuses on a simple goal: make a bot easy to extend without losing structure.

        $Core$
        ::::::
        ### Core
        ::::::
        The architecture is split into clear parts:
            - §CommandManager§ = loads and registers slash commands from the filesystem.
            - §EventManager§   = loads classic Discord events, custom events and database events.
            - §Database§       = connects MongoDB and exposes user and guild models.
            - §Preconditions§  = central rules used before command execution.

        $Features$
        ::::::
        ### Features
        ::::::
        Commands currently available include:
            - §/configuration lang§ to change the guild language.
            - §/managers list white§ and §/managers list black§ to manage whitelist and blacklist views.
            - §/managers client username§, §avatar§ and §activity§ to manage the bot profile.

        Customizable events include:
            - Discord events such as §ClientReady§ and §InteractionCreate§
            - custom execution events for slash commands, autocomplete, buttons and select menus
            - database events for whitelist and blacklist updates

        $Preconditions and database$
        ::::::
        ### Preconditions and database
        ::::::
        Preconditions already available:
            - §blacklistDisallowed§
            - §forBotOwnerOnly§
            - §forGuildAdminsOnly§
            - §forGuildOwnerOnly§

        MongoDB models already present:
            - §User§ = username, blacklist, whitelist, warns, evidences
            - §Guild§ = guild name and language

        $Setup$
        ::::::
        ### Setup
        ::::::
        The repository is installed in this workspace with its dependencies, and a §.env§ file has been created from §.env.example§ so you can fill your own values and test it safely.
        `,
        description_fr: `
        $Presentation$
        Un handler de bot Discord écrit en Typescript avec Discord.js et MongoDB.

        Ce projet cherche surtout a rendre un bot simple a étendre sans perdre une structure propre.

        $Architecture$
        ::::::
        ### Architecture
        ::::::
        Le projet est découpé en parties:
            - §CommandManager§ = charge et enregistre les slash commands depuis le système de fichiers.
            - §EventManager§   = charge les évènements Discord, les évènements custom et les évènements base de données.
            - §Database§       = connecte MongoDB et applique les modèles utilisateur et serveur.
            - §Préconditions§  = règles centralisées exécutées avant une commande.

        $Fonctionnalités$
        ::::::
        ### Fonctionnalités
        ::::::
        Les commandes déjà disponibles sont:
            - §/configuration lang§ pour changer la langue d'un serveur.
            - §/managers list white§ et §/managers list black§ pour gérer les vues whitelist et blacklist.
            - §/managers client username§, §avatar§ et §activity§ pour gérer le profil du bot.

        Les évènements personnalisables couvrent:
            - des évènements Discord comme §ClientReady§ et §InteractionCreate§
            - des évènements custom pour slash commands, autocomplete, boutons et menus
            - des évènements base de données pour les mises à jour whitelist et blacklist

        $Préconditions et base de données$
        ::::::
        ### Préconditions et base de données
        ::::::
        Les préconditions déjà présentes sont:
            - §blacklistDisallowed§
            - §forBotOwnerOnly§
            - §forGuildAdminsOnly§
            - §forGuildOwnerOnly§

        Les modeles MongoDB déjà présents sont:
            - §User§ = pseudo, blacklist, whitelist, warns, evidences
            - §Guild§ = nom du serveur et langue

        $Installation$
        ::::::
        ### Installation
        ::::::
        Le depot est installe dans ce workspace avec ses dependances, et un fichier §.env§ a ete cree depuis §.env.example§ pour que tu puisses ajouter tes propres informations et tester ensuite.
        `    
    },
    {
        name: 'French verifications (Golang)',
        category: 'misc',
        githubLink: 'https://github.com/TheTesterss/french-verif-apis',
        images: [],
        tests: [
            {
                type: 'api_request',
                title: 'French ratio API',
                title_fr: 'API Pourcentage Francais',
                endpoint: '/api/tests/http/request',
                baseUrl: 'http://localhost:8090',
                initialMethod: 'POST',
                initialRoute: '/api/french/ratio',
                initialParams: ``,
                initialQueries: ``,
                initialBody: `{
  "text": "Bonjour, j'essaie un texte francais simple pour vérifier le score."
}`
            },
            {
                type: 'api_request',
                title: 'French word API',
                title_fr: 'API Existence Mot',
                endpoint: '/api/tests/http/request',
                baseUrl: 'http://localhost:8090',
                initialMethod: 'GET',
                initialRoute: '/api/french/words/:word',
                initialParams: `word: bonjour`,
                initialQueries: ``,
                initialBody: `{}`
            }
        ],
        description: `
        $Presentation$
        A Go project turned into a small HTTP API that checks if a text looks French.

        The goal is simple: keep the code easy to modify while making the result faster and easier to test from the portfolio.

        $API$
        ::::::
        ### API
        ::::::
        The main entry point is now an API server with two routes:
            - §POST /api/french/ratio§ to return the percentage of French words inside a text
            - §GET /api/french/words/:word§ to verify if one word exists in French

        $Logic$
        ::::::
        ### Logic
        ::::::
        The verification now uses three clear steps:
            - §tokenization§ = split a text into lowercase words using Unicode letters
            - §common words map§ = preload 150 frequent French words to avoid remote lookups on the most common cases
            - §Larousse lookup + cache§ = check unknown words online once, then keep the result in memory

        `,
        description_fr: `
        $Presentation$
        Un projet Go transformé en petite API HTTP pour vérifier si un texte ressemble à du francais.

        Le but est simple: garder un code facile a modifier tout en rendant le résultat plus rapide et plus simple a tester depuis le portfolio.

        $API$
        ::::::
        ### API
        ::::::
        Le point d'entrée principal est maintenant un serveur API avec deux routes:
            - §POST /api/french/ratio§ pour renvoyer le pourcentage de mots francais dans un texte
            - §GET /api/french/words/:word§ pour vérifier si un mot existe en francais

        $Logique$
        ::::::
        ### Logique
        ::::::
        La vérification suit maintenant trois étapes:
            - §tokenization§ = découper un texte en mots minuscules avec les lettres Unicode
            - §map de mots fréquents§ = précharger 150 mots francais courants pour éviter les appels sur les cas les plus communs
            - §lookup Larousse + cache§ = vérifier les mots inconnus une seule fois en ligne, puis garder le résultat en mémoire
        `    
    }
];

export const timelineData = [
    {
        date: {
            fr: 'Juin 2021',
            en: 'June 2021'
        },
        title: {
            fr: 'Début du code',
            en: 'Start of coding'
        },
        color: 'red-500',
        description: {
            en: 'Started web development with online tutorials. Mainly learned HTML and what can be done with it by following sites and tutorials from w3school, openclassroom and grafikart.',
            fr: 'Je commence le développement web avec des tutoriels en ligne. J\'ai appris principalement le HTML et ce qu\'on peut faire avec en suivant des sites et tutoriels de w3school, openclassroom et grafikart.'
        }
    },
    {
        date: {
            fr: 'Juillet 2021',
            en: 'July 2021'
        },
        title: {
            fr: 'Approfondissement',
            en: 'Deepening'
        },
        color: 'green-500',
        description: {
            en: 'To continue with HTML, I learnt CSS and applied it more deeply. Now I turn to technologies like tailwind and bootstrap to simplify things.',
            fr: 'Pour continuer dans la lancée du HTML, j\'ai appris le CSS et l\'est appliqué plus en profondeur. Puis désormais je me tourne vers des technologies comme tailwind et bootstrap pour simplifier.'
        }
    },
    {
        date: {
            fr: 'Octobre 2021',
            en: 'October 2021'
        },
        title: {
            fr: 'Complétion des compétences web',
            en: 'Web skills completion'
        },
        color: 'cyan-500',
        description: {
            en: 'After HTML and CSS, I learned Javascript to add animations. Creating my first web project for school which was quite atypical. I learned how to manage html and css in Javascript, adding various elements to html, modifying css environment variables for dark themes.',
            fr: 'Après HTML et CSS, j\'ai appris Javascript pour ajouter des animations. Créant mon premier projet web pour les cours qui fût assez atypique. J\'ai appris comment gérer html et css en Javascript, ajoutant divers éléments au html, modifiant les variables d\'environnements css pour des thèmes sombres.'
        }
    },
    {
        date: {
            fr: 'Mars 2022',
            en: 'March 2022'
        },
        title: {
            fr: 'Le vrai code',
            en: 'Real coding'
        },
        color: 'magenta-500',
        description: {
            en: 'I started real code, outside my domain which was web. I started learning Node.js mainly for discord bot learning how to use websocket apis and rest apis. Interfaces were way more easy to create games...',
            fr: 'J\'ai commencé le vrai code, en dehors de mon domaine qui était le web. J\'ai appris Node.js principalement pour les bots discord, apprenant l\'usage d\'apis rest et websocket. Les interfaces étaient simples pour les jeux...'
        }
    },
    {
        date: {
            fr: 'Décembre 2022',
            en: 'December 2022'
        },
        title: {
            fr: 'Le backend + Typescript',
            en: 'Backend + Typescript'
        },
        color: 'blue-500',
        description: {
            en: 'Using rest apis for months was nice but learning how to make some was better. Using express to create some to return images or json datas, adding filters... Learning Typescript allowed me to be more precise mainly for big projects.',
            fr: 'Utilisant les apis rest pendant des mois était sympa mais apprendre comment en faire était meilleur. En utilisant express pour en créer pour renvoyer images ou données JSON, ajouter des filtres... Apprendre Typescript m\'a permis d\'être plus précis principalement pour de gros projets.'
        }
    },
    {
        date: {
            fr: 'Septembre 2023',
            en: 'September 2023'
        },
        title: {
            fr: 'Rentrée en première',
            en: 'Start of penultimate year'
        },
        color: 'orange-500',
        description: {
            en: "I started the last two years of high school. I took my specialities for the Baccalaureate: mathematics, economic and social sciences as well as digital and computer science. The digital was relevant for the theory although in practice I knew how to reproduce almost all the programs, I learned algorithms, complexities, how a computer works...",
            fr: 'J\'ai commencé les deux dernières années de lycée. J\'ai pris mes spécialités pour le Baccaulauréat: mathématiques, sciences économiques et sociales ainsi que numérique et sciences informatiques. Le numérique était pertinant pour la théorie bien qu\'en pratique je savais reproduire la quasi totalité des programmes, j\'ai appris des algorithmes, les complexités, comment marche un ordinateur...'
        }
    },
    {
        date: {
            fr: 'Septembre 2024',
            en: 'September 2024'
        },
        title: {
            fr: 'Rentrée en terminale',
            en: 'Start of final year'
        },
        color: 'gray-300',
        description: {
            en: 'Last year of high school. The theory is still as interesting. I learned new things such as sql (I only knew mongodb), graph and tree theory that I had already used in practice without knowing the theory.',
            fr: 'Dernière année de lycée. La théorie est toujours aussi intéréssante. J\'ai appris de nouvelles choses comme le sql (je connaissais uniquement mongodb), la théorie des graphes et arbres que j\'avais déjà utilisé en pratique sans en savoir la théorie.'
        }
    },
    {
        date: {
            fr: 'Novembre 2024',
            en: 'November 2024'
        },
        title: {
            fr: 'Go + Algorithme',
            en: 'Go + Algorithm'
        },
        color: 'cyan-500',
        description: {
            en: 'I started learning go since C++ was the second choice and I did not like it that much. In go there is still memory management and a lot of pointers. I learned some algorithms.',
            fr: 'J\'ai commencé à apprendre le go puisque C++ était le second choix et je l\'aimais pas tant. En go il y a toujours de la gestion de la mémoire et beaucoup de pointages. J\'ai appris quelques algorithmes.'
        }
    },
    {
        date: {
            fr: 'Janvier 2025',
            en: 'January 2025'
        },
        title: {
            fr: 'React + TailwindCSS',
            en: 'React + TailwindCSS'
        },
        color: 'blue-500',
        description: {
            en: 'Came back to making sites, I learnt a new technology to make site conception easier and better. I learnt react for the simplicity and the presence everything allowing me to ask for help to lot of people. Tailwind is easy so I used it as it was present everywhere.',
            fr: 'De retour pour faire des sites, j\'ai appris de nouvelles technologies pour la conception de sites, les rendants faciles et meilleurs. J\'ai appris react pour sa simplicité et sa présence partout m\'aidant pour demander de l\'aide. Tailwind est facile, je l\'ai donc utilisé puisqu\'il est présent partout.'
        }
    },
    {
        date: {
            fr: 'Juin 2025',
            en: 'June 2025'
        },
        title: {
            fr: 'Approfondissement',
            en: 'Deepening'
        },
        color: 'yellow-500',
        description: {
            en: 'Starting code daily, started project and continued them such as a shell, my portfolio, my own interpreter.',
            fr: 'J\'ai commencé le code quotidiennement, commençant des projets et continuant certains tels qu\'un shell, un portfolio, un interpréteur.'
        }
    },
    {
        date: {
            fr: 'Septembre 2025',
            en: 'September 2025'
        },
        title: {
            fr: 'Début de la prépa',
            en: 'Start of prep year'
        },
        color: 'green-500',
        description: {
            en: 'Beginning of the prep year. I started learning the fundamentals of the subjects I would be studying. The pace is intense and the classes are long and difficult.',
            fr: 'Début de la prépa. J\'ai commencé à apprendre les bases des matières que je suivrais. Le rythme est intense et les cours sont longs et difficiles.'
        }
    },
    {
        date: {
            fr: 'Janvier 2026',
            en: 'January 2026'
        },
        title: {
            fr: 'Avancements',
            en: 'Progress'
        },
        color: 'magenta-500',
        description: {
            fr: 'J\'ai continue la prépa malgré moins de motivations à cause de matières qui ne m\'intéressent pas (physique et sciences de l\'ingénieur). Les khôlles sont dures, les DS le samedi aussi. L\'informatique me plaît ainsi que les mathématiques bien que je n\'y arrive pas. J\'ai fais le choix d\'une réorientation en licence d\'informatique.',
            en: 'I continued the prep year despite less motivation because of subjects that do not interest me (physics and engineering sciences). The khôlles are hard, the DS on Saturday too. Computer science pleases me as well as mathematics although I do not succeed in it. I made the choice of a reorientation in computer science license.'
        }
    }
];

export const USERNAME = 'TheTesters';
export const AUTHOR_NAME = 'Morgan Jaouen';

export const GUILD_ID = '1355918524970827846';
export const GUILD_URI = 'https://discord.gg/zzCDW6Nhsq';
export const GIT_USERNAME = 'TheTesterss';
