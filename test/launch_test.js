const assert = require("assert");
const createApplication = require("./createApplication");

describe("Test application launching", function () {
    let app;
    this.timeout(10000);
    beforeEach(() => {
        app = createApplication();
        return app.start()
    });
    afterEach(() => app.stop());

    it("One window is displayed after application launch", function () {
        return app.client.getWindowCount()
            .then((count) => assert.equal(count, 1));
    })
});
