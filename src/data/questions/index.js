import word01 from "./word-01.js";
import word02 from "./word-02.js";
import word03 from "./word-03.js";
import word04 from "./word-04.js";
import word05 from "./word-05.js";
import excel01 from "./excel-01.js";
import excel02 from "./excel-02.js";
import excel03 from "./excel-03.js";
import excel04 from "./excel-04.js";
import excel05 from "./excel-05.js";
import ppt01 from "./ppt-01.js";
import ppt02 from "./ppt-02.js";
import ppt03 from "./ppt-03.js";
import ppt04 from "./ppt-04.js";
import ppt05 from "./ppt-05.js";
import html501 from "./html5-01.js";
import html502 from "./html5-02.js";
import html503 from "./html5-03.js";
import html504 from "./html5-04.js";
import html505 from "./html5-05.js";
import css301 from "./css3-01.js";
import css302 from "./css3-02.js";
import css303 from "./css3-03.js";
import css304 from "./css3-04.js";
import css305 from "./css3-05.js";

export const questionBanksByLesson = {
  "word-01": word01,
  "word-02": word02,
  "word-03": word03,
  "word-04": word04,
  "word-05": word05,
  "excel-01": excel01,
  "excel-02": excel02,
  "excel-03": excel03,
  "excel-04": excel04,
  "excel-05": excel05,
  "ppt-01": ppt01,
  "ppt-02": ppt02,
  "ppt-03": ppt03,
  "ppt-04": ppt04,
  "ppt-05": ppt05,
  "html5-01": html501,
  "html5-02": html502,
  "html5-03": html503,
  "html5-04": html504,
  "html5-05": html505,
  "css3-01": css301,
  "css3-02": css302,
  "css3-03": css303,
  "css3-04": css304,
  "css3-05": css305,
};

export function getModuleQuestionBank(courseModule) {
  return courseModule.lessons.flatMap((lesson) => questionBanksByLesson[lesson.id]);
}
