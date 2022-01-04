export default class BaseController {
  constructor(db, model) {
    this.db = db
    this.model = model
  }

  errorHandler = (err, res) => {
    console.error("Error you doofus!", err);
    const data = {
      text: "Error doofus! Go back and try again!",
      link: "/",
      link_text: "go Home",
    };
    res.render("pages/error", { data });
  };

  async getAll(req, res) {
    try {
      const results = await this.model.findAll();
      console.log(results)
      return results
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }
}
