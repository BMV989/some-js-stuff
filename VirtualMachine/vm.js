const fs = require("fs");
const path = require("path");

function bf(program, input, number_of_bits = 8, memory_size = 30000) {
    const cell_size = Math.pow(2, number_of_bits) - 1;
    const memory = new Array(memory_size).fill(0);

    let instruction_pointer = 0;
    let memory_pointer = 0;
    let address_stack = [];
    let output = "";

    function send_output(value) {
        output += String.fromCharCode(value);
    }

    function get_input() {
        let value = 0;
        if (input) {
            value = input.charCodeAt(0);
            input = input.substr(1);
        }
        return value;
    }

    function interpret() {
        while (instruction_pointer < program.length) {
            switch (program[instruction_pointer]) {
                case ">":
                    if (memory_pointer === memory.length - 1) {
                        memory_pointer = 0;
                    } else {
                        memory_pointer++;
                    }
                    break;
                case "<":
                    if (memory_pointer === 0) {
                        memory_pointer = memory_size - 1;
                    } else {
                        memory_pointer--;
                    }
                    break;
                case "+":
                    if (memory[memory_pointer] === cell_size) {
                        memory[memory_pointer] = 0;
                    } else {
                        memory[memory_pointer]++;
                    }
                    break;
                case "-":
                    if (memory[memory_pointer] === 0) {
                        memory[memory_pointer] = cell_size;
                    } else {
                        memory[memory_pointer]--;
                    }
                    break;
                case ".":
                    send_output(memory[memory_pointer]);
                    break;
                case ",":
                    memory[memory_pointer] = get_input();
                    break;
                case "[":
                    if (memory[memory_pointer]) {
                        address_stack.push(instruction_pointer);
                    } else {
                        let counter = 0;
                        while (true) {
                            instruction_pointer++;
                            if (!program[instruction_pointer]) break;
                            if (program[instruction_pointer] === "[") counter++;
                            if (program[instruction_pointer] === "]") {
                                if (counter) counter--;
                                else break;
                            }
                        }
                    }
                    break;
                case "]":
                    instruction_pointer = address_stack.pop() - 1;
                    break;
                default:
                    break;
            }
            instruction_pointer++;
        }
        return output.trim();
    }
    return interpret();
}

const file_name = process.argv[2];
let first_number = process.argv[3];
let second_number = process.argv[4];

if (path.extname(file_name) !== ".bf" && path.extname(file_name) !== ".b") {
    console.log(
        "[*] ERROR: Invalid file extension! Provide valid brainfuck file"
    );
    process.exit(1);
}

if (
    !Number.isInteger(parseFloat(first_number)) ||
    !Number.isInteger(parseFloat(second_number))
) {
    console.log(
        "[*] ERROR: We're not working with non-integer types! Provide two integers"
    );
    process.exit(2);
}

first_number = Math.abs(parseInt(first_number));
second_number = Math.abs(parseInt(second_number));

const program = fs.readFileSync(file_name, "utf-8");
const input = `${first_number}\n${second_number}\n`;

console.log(bf(program, input, 32));
