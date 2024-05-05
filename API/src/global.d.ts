declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined

    HOST: string
    PORT: string

    BASE_URL: string

    JWT_SECRET: string

    ADMIN_PASS: string
  }
}
