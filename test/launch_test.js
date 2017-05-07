const Application = require("spectron").Application;
const electron = require("electron");
const path = require("path");
const assert = require("assert");

const app = new Application({
    path: electron,
    args: [path.join(__dirname, "..")]
});

describe("Test application launching", function () {
    this.timeout(10000);
    beforeEach(() => app.start());
    afterEach(() => app.stop());

    it("One window is displayed after application launch", function () {
        return app.client.getWindowCount()
            .then((count) => assert.equal(count, 1));
    })
});
