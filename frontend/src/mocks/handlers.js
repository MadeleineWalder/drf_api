import { rest } from "msw";

const baseURL = "https://drfapi1-f061a902d0e8.herokuapp.com/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk:3,
        username:"User1",
        email:"",
        first_name:"",
        last_name:"",
        profile_id:3,
        profile_image:"https://res.cloudinary.com/dn0xxjn32/image/upload/v1/media/../default_profile_qdjgyp",
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];



