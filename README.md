# LWCF - The Lightweight Command-Line Framework

LWCF is an open-source lightweight command-line framework, focused on simplicity and performance as well as accessibility.

It's focused on TypeScript and Javascript not binding to any specific language, it provides run-time running of TypeScript as well if someone might use that idk.

> TIP: The application can be packaged by using `@zeit/pkg`, making it super easy to create an executable for all platforms, without having to install NodeJS on the machine.

> WARNING: The project is in heavy development, and might introduce breaking changes later on.
> Using the project in production will require you to revalidate the code, and target your version directly to the version you are sure works. ( Just make sure to test it before releasing it )
---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.15.0

    $ npm --version
    6.13.4

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone git@github.com:ch99q/lwcf.git
    $ cd lwcf
    $ yarn bootstrap

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ch99q/lwcf/tags).

## Authors

- **Christian Hansen** - _Initial work_ - [ch99q](https://github.com/ch99q)

See also the list of [contributors](https://github.com/ch99q/lwcf/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
