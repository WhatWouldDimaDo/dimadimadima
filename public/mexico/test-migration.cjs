/* test-migration.cjs
   Standalone check of the store-migration logic used by app.js (loadStore /
   normaliseStore). Loads data.js in a sandbox (it only assigns window.CDMX,
   so a plain vm context is enough) and re-implements the same normalisation
   functions app.js uses, so this can run under plain Node without a DOM.

   Run: node test-migration.cjs
*/

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var assert = require("assert");

var dataPath = path.join(__dirname, "data.js");
var src = fs.readFileSync(dataPath, "utf8");
var sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: "data.js" });
var D = sandbox.window.CDMX;
assert.ok(D && D.places && D.places.length, "data.js did not produce window.CDMX.places");

var byId = {};
D.places.forEach(function (p) { byId[p.id] = p; });

function blankPlan() {
  var o = {};
  D.days.forEach(function (d) { o[d.id] = []; });
  return o;
}
function slotExists(id) {
  return D.slots.some(function (s) { return s.id === id && !s.block; });
}
function normalisePlan(raw) {
  var out = blankPlan();
  if (!raw || typeof raw !== "object") return out;
  Object.keys(out).forEach(function (dayId) {
    var arr = Array.isArray(raw[dayId]) ? raw[dayId] : [];
    out[dayId] = arr
      .filter(function (it) { return it && byId[it.p]; })
      .map(function (it) {
        return { p: it.p, s: slotExists(it.s) ? it.s : "afternoon", n: it.n || "" };
      });
  });
  return out;
}
function normaliseVisits(raw) {
  var out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).forEach(function (id) {
    if (!byId[id]) return;
    var v = raw[id];
    if (!v || typeof v !== "object") return;
    out[id] = {
      on: typeof v.on === "string" ? v.on : "1970-01-01",
      note: typeof v.note === "string" ? v.note : ""
    };
  });
  return out;
}
function normaliseStore(raw) {
  if (raw && typeof raw === "object" && raw.v === 2) {
    return { plan: normalisePlan(raw.plan), visits: normaliseVisits(raw.visits) };
  }
  return { plan: normalisePlan(raw), visits: normaliseVisits(null) };
}

var ran = 0;
function check(label, fn) {
  fn();
  ran++;
  console.log("ok - " + label);
}

/* 1. v1 bare plan (old localStorage shape / old share links) */
check("v1 bare plan migrates with empty visits", function () {
  var v1 = {
    wed: [{ p: "alfil", s: "comida", n: "" }],
    thu: [], fri: [], sat: [], sun: [], mon: []
  };
  var r = normaliseStore(v1);
  assert.deepStrictEqual(r.visits, {});
  assert.strictEqual(r.plan.wed.length, 1);
  assert.strictEqual(r.plan.wed[0].p, "alfil");
  assert.strictEqual(r.plan.wed[0].s, "comida");
  D.days.forEach(function (d) { assert.ok(Array.isArray(r.plan[d.id])); });
});

/* 2. v2 wrapper (current shape) round-trips plan and visits */
check("v2 wrapper preserves plan and visits", function () {
  var v2 = {
    v: 2,
    plan: { wed: [{ p: "alfil", s: "comida", n: "" }] },
    visits: { alfil: { on: "2026-07-29", note: "great tacos" }, bogus: { on: "x" } }
  };
  var r = normaliseStore(v2);
  assert.strictEqual(r.plan.wed[0].p, "alfil");
  assert.strictEqual(r.visits.alfil.note, "great tacos");
  assert.strictEqual(r.visits.alfil.on, "2026-07-29");
  // "bogus" is not a real place id and must be dropped
  assert.strictEqual(r.visits.bogus, undefined);
});

/* 3. empty store (nothing in localStorage — JSON.parse(null) yields null) */
check("empty store (null) yields blank plan and no visits", function () {
  var r = normaliseStore(null);
  assert.deepStrictEqual(r.visits, {});
  D.days.forEach(function (d) { assert.deepStrictEqual(r.plan[d.id], []); });
});

/* 4. corrupt string — JSON.parse throws, caller must fall back cleanly */
check("corrupt JSON string does not throw and yields blank store", function () {
  var corrupt = "{not json";
  var parsed = null;
  try { parsed = JSON.parse(corrupt); } catch (e) { parsed = null; }
  var r = normaliseStore(parsed);
  assert.deepStrictEqual(r.visits, {});
  D.days.forEach(function (d) { assert.deepStrictEqual(r.plan[d.id], []); });
});

console.log(ran + " migration checks passed.");
