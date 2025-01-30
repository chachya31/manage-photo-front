export enum API_URL {
  // eslint-disable-next-line spellcheck/spell-checker
  SIGN_UP = "/auth/signup",
  // eslint-disable-next-line spellcheck/spell-checker
  LOGIN = "/auth/signin",
  LOGOUT = "/auth/logout",
  VERIFY_ACCOUNT = "/auth/verify_account",
  RESEND_CONFIRMATION_CODE = "/auth/resend_confirmation_code",
  FORGOT_PASSWORD = "/auth/forgot_password",
  CONFIRM_FORGOT_PASSWORD = "/auth/confirm_forgot_password",
  CHANGE_PASSWORD = "/auth/change_password",
  NEW_TOKEN = "/auth/new_token",
  USER_DETAIL = "/auth/user_detail",

  // Movieテスト
  GET_MOVIE_LIST = "/movies/list",
  QUERY_MOVIES = "/movies/query-movies",
  DETAIL_MOVIE = "/movies/detail",
  ADD_MOVIE = "/movies/add",
  EDIT_MOVIE = "/movies/edit",
  DELETE_MOVIE = "/movies/delete",
}
