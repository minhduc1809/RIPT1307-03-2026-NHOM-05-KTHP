declare module SendEmail {
  export interface Record {
    content: string;
    email: string;
    ngaySend: string;
    subject: string;
  }

  export interface PostEmail {
    content: string;
    subject: string;
    file: any;
  }
}
