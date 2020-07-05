module.exports = function (app, database) {
  // get students timetable
  app.get("/student/tt", (request, result) => {
    // console.log(request.query.studid);
    database
      .collection("studtt")
      .findOne({ studid: request.query.studid }, (err, tt) => {
        if (err) result.send(err);
        else {
          result.send(tt);
          // console.log(tt);
        }
      });
  });

  // update timetable of students
  app.put("/student/:id", (request, result) => {
    let filter = {
      studid: request.body.id,
    };
    let details = {
      $set: {
        studid: request.body.id,
        tt: request.body.tt,
      },
    };
    // console.log(request.body.tt);
    database.collection("studtt").updateOne(filter, details, (err, res) => {
      if (err) {
        result.send(err);
        console.log(err);
      } else {
        result.send("successfully updated");
        console.log("successfully updated");
      }
    });
  });

  // get Section List'
  app.get("/sectionList", (request, result) => {
    database
      .collection("timetable")
      .find({})
      .sort({ Subject: 1, Catalog: 1 })
      .project({
        Subject: 1,
        Catalog: 1,
        "Course Title": 1,
        Section: 1,
        "Class Nbr": 1,
        _id: 0,
      })
      .toArray((err, item) => {
        if (err) {
          result.send(err);
          console.log(err);
        } else result.send(item);
      });
  });

  // get Student List
  app.get("/student", (request, result) => {
    database
      .collection("studentList")
      .find({})
      .toArray((err, item) => {
        if (err) result.send(error);
        else result.send(item);
      });
  });

  // get Prerequisites
  app.get("/prst", (request, result) => {
    // the parameter is always a string
    courseArr = new Set();
    request.query.courseIdentity
      .split(",")
      .forEach((str) => courseArr.add(str));
    database
      .collection("prerequisite")
      .find({
        courseIdentify: { $in: Array.from(courseArr) },
      })
      .toArray((err, prereqs) => {
        if (err) result.send(err);
        else result.send(prereqs);
      });
  });

  // get class timings
  app.get("/timings", (request, result) => {
    database
      .collection("timetable")
      .find({ "Class Nbr": request.query.clsNbr })
      .toArray((err, classDetails) => {
        if (err) result.send(err);
        else result.send(classDetails);
      });
  });

  app.get("/exams", (request, result) => {
    clsnrs = new Set();
    request.query.clsnr.split(",").forEach((str) => {
      clsnrs.add(str.toUpperCase());
    });
    database
      .collection("timetable")
      .find({ "Class Nbr": { $in: Array.from(clsnrs) } })
      .project({
        "Course Title": true,
        "Exam Tm Cd": true,
        "Exam Date": true,
        _id: false,
      })
      .toArray((err, examDetails) => {
        if (err) result.send(err);
        else result.send(examDetails);
      });
  });

  // general

  app.get("/", (requset, result) => {
    result.send("Hi there!!!, This API is running");
  });
};
