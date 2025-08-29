import { describe, it, expect } from "vitest";

describe("Edge Case Shields", () => {
  describe("Array Edge Cases", () => {
    it("should handle empty arrays", () => {
      const emptyArray: any[] = [];
      
      expect(emptyArray.length).toBe(0);
      expect(emptyArray.map(x => x)).toEqual([]);
      expect(emptyArray.filter(x => x)).toEqual([]);
      expect(emptyArray.reduce((acc, val) => acc + val, 0)).toBe(0);
    });

    it("should handle arrays with undefined/null elements", () => {
      const sparseArray = [1, null, undefined, 4];
      
      expect(sparseArray.length).toBe(4);
      expect(sparseArray.filter(x => x != null)).toEqual([1, 4]);
      expect(sparseArray.filter(x => x !== undefined && x !== null)).toEqual([1, 4]);
    });

    it("should handle very large arrays gracefully", () => {
      const largeArray = new Array(1000).fill(0);
      
      expect(largeArray.length).toBe(1000);
      expect(largeArray.every(x => x === 0)).toBe(true);
    });
  });

  describe("Object Edge Cases", () => {
    it("should handle empty objects", () => {
      const emptyObj = {};
      
      expect(Object.keys(emptyObj)).toEqual([]);
      expect(Object.values(emptyObj)).toEqual([]);
      expect(Object.entries(emptyObj)).toEqual([]);
      expect(JSON.stringify(emptyObj)).toBe("{}");
    });

    it("should handle objects with null/undefined values", () => {
      const objWithNulls = {
        a: 1,
        b: null,
        c: undefined,
        d: 0,
        e: "",
        f: false
      };
      
      expect(Object.keys(objWithNulls)).toEqual(["a", "b", "c", "d", "e", "f"]);
      expect(objWithNulls.b).toBe(null);
      expect(objWithNulls.c).toBe(undefined);
      
      // Test filtering out falsy values
      const truthyValues = Object.entries(objWithNulls)
        .filter(([_, value]) => Boolean(value))
        .map(([key, _]) => key);
      expect(truthyValues).toEqual(["a"]);
    });

    it("should handle nested objects safely", () => {
      const nested = {
        level1: {
          level2: {
            level3: null
          }
        }
      };
      
      expect(nested.level1.level2.level3).toBe(null);
      expect(() => nested.level1.level2.level3?.toString()).not.toThrow();
    });
  });

  describe("Number Boundary Cases", () => {
    it("should handle zero and negative zero", () => {
      expect(0).toBe(0);
      expect(-0 == 0).toBe(true); // loose equality
      expect(-0 === 0).toBe(true); // strict equality 
      expect(Object.is(0, -0)).toBe(false); // Object.is distinguishes them
      expect(1 / 0).toBe(Infinity);
      expect(1 / -0).toBe(-Infinity);
    });

    it("should handle negative one and edge integers", () => {
      expect(-1).toBe(-1);
      expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
      expect(Number.MIN_SAFE_INTEGER).toBe(-9007199254740991);
      expect(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });

    it("should handle special number values", () => {
      expect(Number.isNaN(NaN)).toBe(true);
      expect(Number.isFinite(Infinity)).toBe(false);
      expect(Number.isFinite(-Infinity)).toBe(false);
      expect(Number.isFinite(Number.MAX_VALUE)).toBe(true);
    });

    it("should handle division edge cases", () => {
      expect(0 / 0).toBeNaN();
      expect(1 / 0).toBe(Infinity);
      expect(-1 / 0).toBe(-Infinity);
      expect(Infinity / Infinity).toBeNaN();
    });
  });

  describe("String Edge Cases", () => {
    it("should handle empty strings", () => {
      const empty = "";
      
      expect(empty.length).toBe(0);
      expect(empty.trim()).toBe("");
      expect(empty.split(",")).toEqual([""]);
      expect(Boolean(empty)).toBe(false);
    });

    it("should handle whitespace strings", () => {
      const whitespace = "   \t\n  ";
      
      expect(whitespace.length).toBeGreaterThan(0);
      expect(whitespace.trim()).toBe("");
      expect(Boolean(whitespace)).toBe(true);
      expect(Boolean(whitespace.trim())).toBe(false);
    });

    it("should handle special characters", () => {
      const special = "👑⚡🔑";
      
      expect(special.length).toBeGreaterThan(0);
      expect(typeof special).toBe("string");
      expect(special.includes("👑")).toBe(true);
    });
  });

  describe("Null and Undefined Handling", () => {
    it("should distinguish null and undefined", () => {
      expect(null).not.toBe(undefined);
      expect(null == undefined).toBe(true);
      expect(null === undefined).toBe(false);
      expect(typeof null).toBe("object");
      expect(typeof undefined).toBe("undefined");
    });

    it("should handle null/undefined in operations", () => {
      expect(() => null?.toString()).not.toThrow();
      expect(() => undefined?.toString()).not.toThrow();
      expect(null?.toString()).toBe(undefined);
      expect(undefined?.toString()).toBe(undefined);
    });

    it("should handle null/undefined coalescing", () => {
      expect(null ?? "default").toBe("default");
      expect(undefined ?? "default").toBe("default");
      expect(0 ?? "default").toBe(0);
      expect("" ?? "default").toBe("");
      expect(false ?? "default").toBe(false);
    });
  });

  describe("Type Coercion Edge Cases", () => {
    it("should handle unexpected type coercion", () => {
      expect("" + 0).toBe("0");
      expect("" + null).toBe("null");
      expect("" + undefined).toBe("undefined");
      expect([] + []).toBe("");
      expect({} + {}).toBe("[object Object][object Object]");
    });

    it("should handle boolean coercion edge cases", () => {
      expect(Boolean(0)).toBe(false);
      expect(Boolean("")).toBe(false);
      expect(Boolean(null)).toBe(false);
      expect(Boolean(undefined)).toBe(false);
      expect(Boolean(NaN)).toBe(false);
      expect(Boolean([])).toBe(true);
      expect(Boolean({})).toBe(true);
    });
  });
});