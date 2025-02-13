const numbers = [1, 3, 5, 7, 9];

function findMaxProduct(): number[] {
  let maxProduct = 0;
  let maxProductNumbers: number[] = [];

  function combination(start: number, chosen: number[]) {
    if (chosen.length === 3) {
      // numbers가 정렬된 값이기 때문에 큰 index부터 큰 자리수로 계산
      const threeDigit = chosen[2] * 100 + chosen[1] * 10 + chosen[0];
      const remaining = numbers.filter((n) => !chosen.includes(n));
      const twoDigit = remaining[1] * 10 + remaining[0];
      const product = threeDigit * twoDigit;

      if (product > maxProduct) {
        maxProduct = product;
        maxProductNumbers = [threeDigit, twoDigit];
      }
      return;
    }

    for (let i = start; i < numbers.length; i++) {
      chosen.push(numbers[i]);
      combination(i + 1, chosen);
      chosen.pop();
    }
  }

  combination(0, []);
  return maxProductNumbers;
}

const [threeDigit, twoDigit] = findMaxProduct();
console.log('result: ', twoDigit, ', ', threeDigit);
