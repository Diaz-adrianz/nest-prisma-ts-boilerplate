## Nest Prisma TS Boilerplate

A ready to go boilerplate for starting Backend Development project with NestJS. Focused on Simplifies the development process, enhancing efficiency and maintainability. Ensures comprehensive coverage of fundamental and common needs. Continuously striving to stay updated.

## Todos

- [x] Redis integration
- [x] JWT Auth flow management
- [x] Send email with nodemailer
- [ ] Feature access management
- [x] Upload file with multer
- [x] Winston logger integration
- [ ] Jest utilization

## Run Locally

Clone the project

```bash
$ git clone < repository link >
```

Go to the project directory

```bash
$ cd nest-prisma-ts-boilerplate
```

Install dependencies

```bash
$ npm install
```

Run at port 3000

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Tech Stack

- [NestJS 10](https://nestjs.com/)
- [Redis](https://redis.io/)
- [Nodemailer](https://www.nodemailer.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Multer](https://www.npmjs.com/package/multer)
- [Winston logger](https://github.com/winstonjs/winston)
- [Passport](https://www.passportjs.org/)
- [JsonWebToken](https://jwt.io/)

## Project Structure

```sh
prisma
├── migrations                    # Database migrations
├── seeder                        # Database seeder
└── schema.prisma                 # Prisma schema
src
├── config                        # setting and constant value
├── core                          # features' resources
  ├── auth
    ├── guards                    # Auth protection (jwt check and feature access check)
    └── strategies                # Passport auth
  └── < feature >                 # Another features
├── filters                       # Global Error handling
  ├── http-exception.filter.ts    # HttpException class error handling
  └── prisma-exception.filter.ts  # PrismaClientKnownRequest class error handling
├── helper
  ├── decorator                   # Reusable and common decorators
  └── dto                         # Reusable and common dto
├── lib                           # third party and separated modules/services
├── templates                     # static html/hbs e.g for email templating
├── types                         # Typescript data type definition
├── utils                         # Utility functions
└── main.ts                       # project entry point
test
```

## Authors

- [@Diaz-Adrianz](https://github.com/Diaz-adrianz)

## Feedback

If you have any feedback, please reach out me at [email](mailto:diazz.developer@gmail.com)

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
