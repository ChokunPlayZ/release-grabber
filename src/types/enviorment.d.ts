export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        IRC_ADDRESS: string,
        IRC_USERNAME: string,
        NICKSERV_PASS: string,
        MEDUSA_URL: string,
        MEDUSA_API_KEY: string,
        WEBHOOK_URL: string,
        QBIT_BURL: string,
        QBIT_USERNAME: string,
        QBIT_PASSWORD: string,
        QBIT_DOWNLOADPATH: string
    }
  }
}