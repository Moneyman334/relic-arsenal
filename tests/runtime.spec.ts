// tests/runtime.spec.ts
describe("Runtime", () => {
  it("has NODE_ENV defined", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});