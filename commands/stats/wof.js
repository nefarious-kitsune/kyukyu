const MIN_PROB = 0.0005;

module.exports = {
  name: 'wof',
  description: 'Get probability of getting a certain result in a wheel event.',
  usage: '<hero|voucher> <desired quantity> <number of spins>',
  args: true,
  async execute(msg, args) {
    const VOUCHERS = ['voucher', 'vouchers'];
    const SHARDS = ['hero', 'shards', 'shard'];

    const resultType = args[0].toLowerCase();
    if (!VOUCHERS.includes(resultType) && !SHARDS.includes(resultType)) return;

    if (args.length == 1) {
      if (VOUCHERS.includes(resultType)) {
        msg.channel.send('https://cdn.discordapp.com/attachments/'+
            '831064145637539860/833893539812343808/'+
            'WoF_probability_voucher.png');
      } else {
        msg.channel.send('https://cdn.discordapp.com/attachments/'+
            '831064145637539860/833893528090050570/WoF_probability_shard.png');
      }
      return;
    }

    if (args.length < 3) return;

    /**
     * Binomial distribution function
     * @param {number} n number of tries
     * @param {number} p probability
     * @param {number} k number of occurances
     * @return {number} probability
     */
    function bin(n, p, k) {
      const success = Math.pow(p, k);
      const failure = Math.pow(1-p, n-k);

      // binomial coefficient (n choose k)
      // (n, 0) = 1
      // (n, 1) = (n, 0) * (n - 1 + 1) / 1
      // (n, 2) = (n, 1) * (n - 2 + 1) / 2
      // :
      let r = success * failure;
      for (let i = 1; i <= k; i++) {
        r = r * (n - i + 1) / i;
      }
      return r;
    }

    /**
     * Binomial distribution function
     * @param {number} n number of tries
     * @param {number} pA probability of A
     * @param {number} kA number of occurances of A
     * @param {number} pB probability of B
     * @param {number} kB number of occurances of B
     * @return {number} probability
     */
    function bin2(n, pA, kA, pB, kB) {
      const rA = bin(n, pA, kA);
      const rB = bin(n-kA, pB/(1-pA), kB);
      return rA * rB;
    }

    /**
     * Get possible combinations of q1 and q2 that gives resultQty
     * @param {number} resultQty
     * @param {number} q1 probability of item 1
     * @param {number} q2 number of occurances of 1
     * @return {Array.<Array.<number>>}
     */
    function getCombination(resultQty, q1, q2) {
      const r = [];
      let Q1;
      let Q2;
      if (q1 < q2) {
        Q1 = q1;
        Q2 = q2;
      } else {
        Q1 = q2;
        Q2 = q1;
      }
      let n1 = Math.floor(resultQty / Q1);
      let n2 = 0;
      while (n1 >= 0) {
        n2 = (resultQty - (n1 * Q1)) / Q2;
        if (Number.isInteger(n2)) {
          r.push([n1, n2]);
        }
        n1--;
      }
      return r;
    }

    /**
     * @param {number} N total number of tries
     * @param {number} K total occurances
     * @param {number} probA probability of A
     * @param {number} qtyA number of units in A
     * @param {number} probB probability of item B
     * @param {number} qtyB number of units in B
     * @return {number} probability
     */
    function getProbability(N, K, probA, qtyA, probB, qtyB) {
      let prob = 0;
      const combinations = getCombination(K, qtyA, qtyB);
      for (let i=0; i<combinations.length; i++) {
        const kA = combinations[i][0];
        const kB = combinations[i][1];
        prob += prob = bin2(N, probA, kA, probB, kB);
      }
      return prob;
    }

    const spinCount = parseInt(args[2]);
    let totalProb = 0;

    let qty1 = 0;
    let prob1 = 0;
    let qty2 = 0;
    let prob2 = 0;
    let unit = '';

    if (VOUCHERS.includes(resultType)) {
      qty1 = 1;
      prob1 = 0.19; // probability of 1× voucher
      qty2 = 3;
      prob2 = 0.06; // probability of 3× vouchers
      unit = 'vouchers';
    } else {
      qty1 = 1;
      prob1 = 0.016; // probability of 1× shard
      qty2 = 2;
      prob2 = 0.004; // probability of 2× shardss
      unit = 'shards';
    }

    if ( ['mode', 'm'].includes(args[1].toLowerCase()) ) {
      let resultQty = 0;
      let prevProb;
      let thisProb = 0;
      do {
        prevProb = thisProb;
        resultQty++;
        thisProb = getProbability(
            spinCount, resultQty, prob1, qty1, prob2, qty2);
      } while (thisProb > prevProb);
      msg.channel.send(
          `With ${spinCount} spins, the __mode__ is ` +
          `${--resultQty} ${unit} ` +
          `(${Math.round(prevProb*1000)/10}% probability).`
      );
      return;
    }

    const resultRange = /^(\d+)([-+~])?(\d+)?$/.exec(args[1]);

    if (!resultRange) return;

    if (resultRange[2] == '+') {
      if (resultRange[3]) return; // BAD SYNTAX

      let resultQty = parseInt(resultRange[1]);

      if (resultQty > 0.8 * spinCount) return; // NO TROLLING

      let prevProb;
      let thisProb = 0;
      do {
        prevProb = thisProb;
        thisProb = getProbability(
            spinCount, resultQty, prob1, qty1, prob2, qty2);
        totalProb += thisProb;
        resultQty++;
      } while ((thisProb > MIN_PROB) || (thisProb > prevProb));
      msg.channel.send(
          `The probability of getting ${resultRange[1]}+ ${unit} ` +
          `in ${spinCount} spins is ${Math.round(totalProb*1000)/10}%.`
      );
    } else if ((resultRange[2] == '-')||(resultRange[2] == '~')) {
      let resultQty1;
      let resultQty2;
      if (resultRange[3]) {
        resultQty1 = parseInt(resultRange[1]);
        resultQty2 = parseInt(resultRange[3]);
      } else {
        resultQty1 = 1;
        resultQty2 = parseInt(resultRange[1]);
      }
      if (resultQty1 >= resultQty2) return;
      let resultQty = resultQty1;
      let prevProb;
      let thisProb = 0;
      do {
        prevProb = thisProb;
        thisProb = getProbability(
            spinCount, resultQty, prob1, qty1, prob2, qty2);
        totalProb += thisProb;
        resultQty++;
      } while (
        (resultQty < resultQty2) &&
        ((thisProb > MIN_PROB) || (thisProb > prevProb))
      );
      msg.channel.send(
          `The probability of getting ${resultQty1}-${resultQty2} ${unit} ` +
          `in ${spinCount} spins is ${Math.round(totalProb*1000)/10}%.`
      );
    } else {
      let log = '';
      const combinations = getCombination(resultRange[1], qty1, qty2);
      for (let i=0; i<combinations.length; i++) {
        const X1 = combinations[i][0];
        const X2 = combinations[i][1];
        const prob = bin2(spinCount, prob1, X1, prob2, X2);
        if (prob >= 0.001) {
          log += `${Math.round(prob * 1000)/10}% probability of ` +
              `${qty1}×${X1} + ${qty1}×${X2} ${unit}\n`;
        }
        totalProb += prob;
      }
      msg.channel.send(
          `The probability of getting ${resultRange[1]} ${unit} ` +
          `in ${spinCount} spins is ${Math.round(totalProb*1000)/10}%.\n` +
          log
      );
    }
  },
};
