const assert = require("assert");
const createApplication = require("./createApplication");
const EditorPage = require("./editor.page");
const jsdom = require("jsdom").jsdom;

describe("Test of editor input", function () {
    this.timeout(10000);
    let app;
    beforeEach(() => {
        app = createApplication();
        return app.start();
    });
    afterEach(() => app.stop());

    describe("Input markdown text into editor", function () {
        it("HTML is rendered", function () {
            const page = new EditorPage(app.client);
            return page.inputText("# h1heading\n## h2heading")
                .then(() => page.getRenderedHTML())
                .then((html) => {
                    const dom = jsdom(html);
                    const h1 = dom.querySelector("h1");
                    assert.equal(h1.textContent, "h1heading");
                    const h2 = dom.querySelector("h2");
                    assert.equal(h2.textContent, "h2heading");
                });
        });
    });
});