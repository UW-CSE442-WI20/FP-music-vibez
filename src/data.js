import lyrics_index from "../data/lyric-index.json";
import year_index from "../data/year-lyric-index.json";

export function getLyricCounts(year) {
  // [{"text":"study","size":40}]
  console.log("getLyricsCounts!");
  console.log('parameters', year);
  //console.log(year_index);
  console.log(year_index[year]);
  let res = [];
  for (let i = 0; i < 300; i++) {
    res.push(year_index[year][i]);
  }
  //   let res = [
  //     // { text: "foo", size: 40 },
  //     // { text: "bar", size: 32 }
  //   ];
  //   let a = 0;
  //   for (let lyric in lyrics_year_index) {
  //     let count = 0;
  //     for (let year in lyrics_year_index[lyric]) {
  //       count += lyrics_year_index[lyric][year];
  //     }
  //     res.push({ text: lyric, size: count });
  //     a++;
  //     if (a > 1000) {
  //       return res;
  //     }
  //   }
  console.log("done!");
  //console.log(res);
  return res;
}
