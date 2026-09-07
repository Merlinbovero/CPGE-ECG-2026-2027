/* Python s’exécute hors du fil d’interface : une boucle infinie peut être arrêtée. */
"use strict";
var pyodide;
  var HELPER =
    "import json\n" +
    "def _run_test(src, call, expected_src, approx):\n" +
    "    ns = {}\n" +
    "    try:\n" +
    "        exec(src, ns)\n" +
    "    except Exception as e:\n" +
    "        return json.dumps([False, 'ERREUR à l\\'exécution du code : ' + type(e).__name__ + ' : ' + str(e)])\n" +
    "    try:\n" +
    "        got = eval(call, ns)\n" +
    "    except Exception as e:\n" +
    "        return json.dumps([False, 'ERREUR : ' + type(e).__name__ + ' : ' + str(e)])\n" +
    "    try:\n" +
    "        exp = eval(expected_src, {})\n" +
    "    except Exception:\n" +
    "        exp = None\n" +
    "    try:\n" +
    "        if approx:\n" +
    "            ok = abs(got - exp) < 1e-6\n" +
    "        else:\n" +
    "            ok = (got == exp)\n" +
    "    except Exception:\n" +
    "        ok = (repr(got) == repr(exp))\n" +
    "    return json.dumps([bool(ok), repr(got)])\n";


(async function () {
  try {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
    pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" });
    pyodide.runPython(HELPER);
    self.postMessage({ type: "ready" });
  } catch (error) {
    self.postMessage({ type: "error", message: "Impossible de charger Python. Vérifie la connexion puis réessaie." });
  }
})();
self.onmessage = function (event) {
  if (!pyodide || event.data.type !== "run") return;
  var results = event.data.tests.map(function (test) {
    try {
      pyodide.globals.set("_SRC", event.data.code);
      pyodide.globals.set("_CALL", test.call);
      pyodide.globals.set("_EXP", test.expect);
      pyodide.globals.set("_APX", !!test.approx);
      var result = JSON.parse(pyodide.runPython("_run_test(_SRC, _CALL, _EXP, _APX)"));
      return { ok: result[0], got: result[1] };
    } catch (error) {
      return { ok: false, got: "ERREUR : " + error.message };
    }
  });
  self.postMessage({ type: "results", results: results });
};
