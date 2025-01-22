<p align="center">
  <a href="https://github.com/suitenumerique/docs">
    <img alt="Docs" src="/docs/assets/logo-docs.png" width="300" />
  </a>
</p>

<p align="center">
Welcome to Docs! The open source document editor where your notes can become knowledge through live collaboration
</p>

<p align="center">
  <a href="https://matrix.to/#/#docs-official:matrix.org">
    Chat on Matrix
  </a> - <a href="/docs/">
    Documentation
  </a> - <a href="#getting-started">
    Getting started
  </a>
</p>

<img src="/docs/assets/docs_live_collaboration_light.gif" width="100%" align="center"/>

## Why use Docs ❓
Docs is a collaborative text editor designed to address common challenges in knowledge building and sharing.

### Write
*   😌 Simple collaborative editing without the formatting complexity of markdown
*   🔌 Offline? No problem, keep writing, your edits will get synced when back online
*   💅 Create clean documents with limited but beautiful formatting options and focus on content
*   🧱 Built for productivity (markdown support, many block types, slash commands, markdown support, keyboard shortcuts) (page in french sorry 😅).
*   ✨ Save time thanks to our AI actions (generate, sum up, correct, translate)

### Collaborate
*   🤝 Collaborate in realtime with your team mates
*   🔒 Granular access control to keep your information secure and shared with the right people
*   📑 Professional document exports in multiple formats (.odt, .doc, .pdf) with customizable templates
*   📚 Built-in wiki functionality to transform your team's collaborative work into organized knowledge `ETA 02/2025`

### Self-host
*   🚀 Easy to install, scalable and secure alternative to Notion, Outline or Confluence

## Getting started 🔧
### Test it
Test Docs on your browser by logging in on this [environment](https://impress-preprod.beta.numerique.gouv.fr/docs/0aa856e9-da41-4d59-b73d-a61cb2c1245f/)
```
email: test.docs@yopmail.com
password: I'd<3ToTestDocs
```
### Run it locally
**Prerequisite**
Make sure you have a recent version of Docker and [Docker Compose](https://docs.docker.com/compose/install) installed on your laptop:

```shellscript
$ docker -v

Docker version 20.10.2, build 2291f61

$ docker compose -v

docker compose version 1.27.4, build 40524192
```

> ⚠️ You may need to run the following commands with sudo but this can be avoided by assigning your user to the `docker` group.

**Project bootstrap**
The easiest way to start working on the project is to use GNU Make:

```shellscript
$ make bootstrap FLUSH_ARGS='--no-input'
```

This command builds the `app` container, installs dependencies, performs database migrations and compile translations. It's a good idea to use this

command each time you are pulling code from the project repository to avoid dependency-releated or migration-releated issues.

Your Docker services should now be up and running 🎉

You can access to the project by going to <http://localhost:3000>.

You will be prompted to log in, the default credentials are:

```shellscript
username: impress

password: impress
```

📝 Note that if you need to run them afterwards, you can use the eponym Make rule:

```shellscript
$ make run-with-frontend
```

⚠️ For the frontend developper, it is often better to run the frontend in development mode locally.

To do so, install the frontend dependencies with the following command:

```shellscript
$ make frontend-install
```

And run the frontend locally in development mode with the following command:

```shellscript
$ make run-frontend-development
```

To start all the services, except the frontend container, you can use the following command:

```shellscript
$ make run
```

**Adding content**
You can create a basic demo site by running:

```shellscript
$ make demo
```

Finally, you can check all available Make rules using:

```shellscript
$ make help
```

**Django admin**
You can access the Django admin site at

<http://localhost:8071/admin>.

You first need to create a superuser account:

```shellscript
$ make superuser
```

## Feedback 🙋‍♂️🙋‍♀️
We'd love to hear your thoughts and hear about your experiments, so come and say hi on [Matrix](https://matrix.to/#/#docs-official:matrix.org).

## Roadmap
Want to know where the project is headed? [🗺️ Checkout our roadmap](https://github.com/orgs/numerique-gouv/projects/13/views/11)

## Licence 📝
This work is released under the MIT License (see [LICENSE](https://github.com/suitenumerique/docs/blob/main/LICENSE)).

While Docs is public driven initiative our licence choice is an invitation for private sector actors to use, sell and contribute to the project. 

## Contributing 🙌
This project is intended to be community-driven, so please, do not hesitate to get in touch if you have any question related to our implementation or design decisions.

If you intend to make pull requests see [CONTRIBUTING](https://github.com/suitenumerique/docs/blob/main/CONTRIBUTING.md) for guidelines.

Directory structure:

```markdown
docs
├── bin - executable scripts or binaries that are used for various tasks, such as setup scripts, utility scripts, or custom commands.
├── crowdin - for crowdin translations, a tool or service that helps manage translations for the project.
├── docker - Dockerfiles and related configuration files used to build Docker images for the project. These images can be used for development, testing, or production environments.
├── docs - documentation for the project, including user guides, API documentation, and other helpful resources.
├── env.d/development - environment-specific configuration files for the development environment. These files might include environment variables, configuration settings, or other setup files needed for development.
├── gitlint - configuration files for `gitlint`, a tool that enforces commit message guidelines to ensure consistency and quality in commit messages.
├── playground - experimental or temporary code, where developers can test new features or ideas without affecting the main codebase.
└── src - main source code directory, containing the core application code, libraries, and modules of the project.
```

## Credits ❤️
### Stack
Docs is built on top of [Django Rest Framework](https://www.django-rest-framework.org/), [Next.js](https://nextjs.org/), [MinIO](https://min.io/) and [BlockNote.js](https://www.blocknotejs.org/)

### States ❤️ open source
Docs is the result of a joint effort lead by the French 🇫🇷🥖 ([DINUM](https://www.numerique.gouv.fr/dinum/)) and German 🇩🇪🥨 government ([ZenDiS](https://zendis.de/)). We are always looking for new public partners feel free to reach out if you are interested in using or contributing to docs.