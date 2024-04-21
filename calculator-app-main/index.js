
document.addEventListener("DOMContentLoaded", () => {
    const resultEl = document.querySelector("#result");
    let theme = document.querySelector('#switch input[name="theme"]:checked').value;

    const checkOps = ["+", "-", "/", "x", "."];
    const ops = ["+", "-", "/", "x"];
    let stack = ["0"]; // After '=' is hit, add to the stack
    let operation = resultEl.innerHTML.trim();

    document.getElementById("switch").addEventListener("click", (e) => {
        if (e.target.matches("input[type='radio']")) {
            let theme = e.target.value;
            document.getElementById("main").setAttribute("class", "");
            document.getElementById("main").setAttribute("class", `theme-${theme}`);
        }
    })

    document.getElementById("keypad-ctr").addEventListener("click", (e) => {
        if (e.target.matches("button")) {
            let value = e.target.innerHTML;

            switch (value) {
                case "RESET":
                    stack = ["0"];
                    operation = "0";
                    resultEl.innerHTML = operation;
                    break;

                case "DEL":
                    if (stack.length === 1)
                        stack[0] = "0";
                    else
                        stack.pop();

                    operation = stack.join("");
                    resultEl.innerHTML = operation;
                    break;

                case "=":
                    let lastChar = stack[stack.length-1];
                    if (!checkOps.includes(lastChar)) {
                        let combined = [];
                        let tempNum = "";
                        stack.forEach((val, idx) => {
                            if (ops.includes(val)){
                                combined.push(tempNum);
                                tempNum = "";
                                combined.push(val);
                            }
                            else {
                                tempNum += val;
                            }

                            if (idx === stack.length - 1) {
                                // Push remaining
                                combined.push(tempNum);
                                tempNum = null;
                            }
                        })

                        // Calculate total
                        let lastVal = null;
                        let op = null;
                        combined.forEach((val) => {
                            if (lastVal && op) {
                                if (op === "+")
                                    lastVal = lastVal + parseFloat(val);
                                else if (op === "-")
                                    lastVal = lastVal - parseFloat(val);
                                else if (op === "/")
                                    lastVal = lastVal / parseFloat(val);
                                else if (op === "x")
                                    lastVal = lastVal * parseFloat(val);

                                op = null;
                            }
                            else {
                                if (ops.includes(val)) {
                                    op = val;
                                }
                                else {
                                    lastVal = parseFloat(val);
                                }
                            }
                        })

                        operation = lastVal.toString();
                        stack = [...operation.split("")];
                        resultEl.innerHTML = operation;
                    }
                    break;

                default:
                    if (stack.length === 1 && stack[0] === "0")
                        stack.pop();

                    if (checkOps.includes(value) && stack[stack.length - 1] !== value || !checkOps.includes(value)) {
                        // Skip duplicate operators
                        stack.push(value);
                        operation = stack.join("");
                        resultEl.innerHTML = operation;
                    }
            }
        }
    })


})