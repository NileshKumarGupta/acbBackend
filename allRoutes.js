module.exports = function (app, database) {
  // get students timetable
  app.get("/student/tt", (request, result) => {
    console.log(request.query.studid);
    database
      .collection("studtt")
      .findOne({ studid: request.query.studid }, (err, tt) => {
        if (err) result.send(err);
        else {
          result.send(tt);
          console.log(tt);
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
    console.log(request.body.tt);
    database.collection("studtt").updateOne(filter, details, (err, res) => {
      if (err) {
        result.send(err);
        console.log(err);
      } else {
        result.send("success");
        console.log("success");
      }
    });
  });

  // get Section List'
  app.get("/sectionList", (request, result) => {
    database
      .collection("timetable")
      .find({})
      .project({
        Subject: 1,
        Catalog: 1,
        "Course Title": 1,
        Section: 1,
        "Class Nbr": 1,
        _id: 0,
      })
      .toArray((err, item) => {
        if (err) result.send(error);
        else result.send(item);
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
    courseArr = [];
    request.query.courseIdentity
      .split(",")
      .forEach((str) => courseArr.push(str));
    print(courseArr);
    database
      .collection("prerequisite")
      .find({
        courseIdentify: { $in: courseArr },
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
      .findOne({ "Class Nbr": request.query.clsNbr }, (err, classDetails) => {
        if (err) result.send(err);
        else result.send(classDetails);
      });
  });

  // generel

  app.get("/", (requset, result) => {
    result.send("Hi there!!!, This API is running");
  });
};
