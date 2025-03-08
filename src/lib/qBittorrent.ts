const qs = require("qs");

export class Client {
  private url: string;
  private username: string;
  private password: string;
  #sid: string | null;

  constructor(url: string, username: string, password: string) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.#sid = null;
  }

  async login() {
    try {
      if (!(await this.checkLogin())) {
        const response = await fetch(`${this.url}/api/v2/auth/login`, {
          method: "POST",
          body: qs.stringify({
            username: this.username,
            password: this.password,
          }),
          headers: {
            Referer: `${this.url}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        this.#sid = response.headers
          .get("set-cookie")!
          .split(";")[0]
          .split("=")[1];

        return this.#sid;
      } else {
        return this.#sid;
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async logout() {
    try {
      if (await this.checkLogin()) {
        const response = await fetch(`${this.url}/api/v2/auth/logout`, {
          method: "POST",
          headers: {
            Referer: `${this.url}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: `SID=${this.#sid}`,
          },
        });

        this.#sid = null;

        return await response.text();
      } else {
        return "Not logged in!";
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async checkLogin() {
    try {
      const response = await fetch(`${this.url}/api/v2/app/version`, {
        method: "GET",
        headers: {
          Referer: `${this.url}`,
          Cookie: `SID=${this.#sid}`,
        },
      });

      if (response.status === 403) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async addTorrent(magnet: string, path: string, category: string) {
    try {
      if (!(await this.checkLogin())) {
        await this.login();
      }

      const response = await fetch(`${this.url}/api/v2/torrents/add`, {
        method: "POST",
        body: qs.stringify({
          urls: magnet,
          savepath: path,
          category: category,
        }),
        headers: {
          Cookie: `SID=${this.#sid}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return await response.text();
    } catch (error) {
      console.error(error);
    }
  }
}
