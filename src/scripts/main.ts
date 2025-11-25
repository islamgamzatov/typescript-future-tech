import Header from "./header.ts";

new Header();

// Тест для console.log
function testConsole() {
  console.log("тест console"); // ДОЛЖЕН показать предупреждение
}

// Тест для == вместо ===
function testEquality(a: number, b: number) {
  if (a == b) { // ДОЛЖЕН показать предупреждение
    return true;
  }
  return a === b; // нормально
}

// Тест для фигурных скобок
function testCurly(condition: boolean) {
  if (condition) 
    {console.log("нет скобок");} // ДОЛЖЕН показать предупреждение
}

// Тест для лишнего else
function testElse(value: number) {
  if (value > 10) {
    return "больше";
  }  // ДОЛЖЕН показать предупреждение
    return "меньше";
  
}
