const data = {
  states: require("../model/states.json"),
  setStates: (data) => {
    this.states = data;
  },
};
const { parseJSON } = require("date-fns");
const State = require("../model/State");

//Get all States
const getStates = async (req, res) => {
  let states = false;     // initialize variable from Json file
  let stateData = false;  // initialize variable from Mondo DB

  // check for contiguous condition
  if (!req?.query.contig){
    states = await State.find();
    stateData = data.states;
  } else if (req.query.contig === 'true') {
    states = await State.find({stateCode:{ $nin: ['AK', 'HI']}});
    stateData = data.states.filter(
      (state) => (state.code != 'AK' && state.code != 'HI'));
  } else if (req.query.contig === 'false') {
    states = await State.find({stateCode:{ $in: ['AK', 'HI']}});
    stateData = data.states.filter(
      (state) => (state.code == 'AK' || state.code == 'HI'));
  }

  //error checking
  if (!states || !stateData)
    return res.status(400).json({ message: "No state found." });

  // add fundfacts
  stateData.forEach(element  => Object.assign(element, { funfacts : 
     states.find((state) => state.code === element.stateCode).funfacts}));

  res.json(stateData);
};

//Get State
const getState = async (req, res) => {
  if (!req?.params?.code) {
  return res.status(400).json({ message: "State code is required. " });
  }
  // from Json file
  const stateData = data.states.find(
    (state) => state.code === req.params.code);
  if (!stateData) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  // from MondoDB (only the funfact's)
  const state = await State.findOne({ stateCode : req.params.code }).exec();
  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  const merged = Object.assign({}, stateData, { funfacts : state.funfacts})  ;
  res.json(merged);
};

const getFunFact = async (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "State code is required. " });
  }
  const state = await State.findOne({ stateCode : req.params.code }).exec();
  
  const funfacts = state.funfacts;
  
  const randomElement = Math.floor(Math.random() * Object.keys(funfacts).length);
  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  res.json(funfacts[randomElement]);
};

const getCapital = (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "State code is required. " });
  }
  const stateData = data.states.find(
    (state) => state.code === req.params.code);
  if (!stateData) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  res.json(stateData.capital_city);
};

const getNickname = (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "State code is required. " });
  }
  const stateData = data.states.find(
    (state) => state.code === req.params.code);
  if (!stateData) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  res.json(stateData.nickname);
};

const getPopulation = (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "State code is required. " });
  }
  const stateData = data.states.find(
    (state) => state.code === req.params.code);
  if (!stateData) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  res.json(stateData.population);
};

const getAdmission  = (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "State code is required. " });
  }
  const stateData = data.states.find(
    (state) => state.code === req.params.code);
  if (!stateData) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  res.json(stateData.admission_date);
};

const postFunFact = async (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "code parameter is required. " });
  }
  const state = await State.findOne({ stateCode: req.params.code }).exec();

  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }

  let newData = req.body.funfacts;
  newData.forEach(element  => state.funfacts.push(element));

  const result = await state.save();
  res.json(result);

};

const patchFunFact = async (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "code parameter is required. " });
  }
  if (!req?.body?.index) {
    return res.status(400).json({ message: "index is required. " });
  }

  const state = await State.findOne({ stateCode: req.params.code }).exec();


  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }
  let newData = req.body.funfacts;
  state.funfacts[req.body.index -1 ] = newData;

  const result = await state.save();
  res.json(result);
};


const deleteFunFact = async (req, res) => {
  if (!req?.params?.code) {
    return res.status(400).json({ message: "code parameter is required. " });
  }
  if (!req?.body?.index) {
    return res.status(400).json({ message: "index is required. " });
  }

  const state = await State.findOne({ stateCode: req.params.code }).exec();

  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.params.code}` });
  }

  state.funfacts.splice([req.body.index-1], 1);

  const result = await state.save();
  res.json(result);
};

// //Get State
// const getState = async (req, res) => {
//   if (!req?.params?.code) {
//     return res.status(400).json({ message: "State code is required. " });
//   }
//   const state = await State.findOne({ code : req.params.code }).exec();

//   if (!state) {
//     return res
//       .status(204)
//       .json({ message: `No State matches code ${req.params.code}` });
//   }
//   res.json(state);
// };

//Create a State 
const createNewState = async (req, res) => {
  if (!req?.body.state || !req?.body.code) {
    return res.status(400).json({ message: "name and code are required" });
  }
  try {
    const result = await State.create({
      state: req.body.state,
      code: req.body.code,
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }

};

//Update State
const updateState = async (req, res) => {
  if (!req?.body.code) {
    return res.status(400).json({ message: "code parameter is required. " });
  }
  const state = await State.findOne({ _code: req.body.code }).exec();

  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.body.code}` });
  }
  if (req.body?.funfacts) state.funfacts = req.body.funfacts;

  const result = await state.save();
  res.json(result);
};

//Delete State
const deleteState = async (req, res) => {
  if (!req?.body.code) {
    return res.status(400).json({ message: "State code is required. " });
  }

  const state = await State.findOne({ _code: req.body.code }).exec();

  if (!state) {
    return res
      .status(204)
      .json({ message: `No State matches code ${req.body.code}` });
  }
  const result = await state.deleteOne({ _code: req.body.code });
  res.json(result);
};

module.exports = {
  getStates,
  updateState,
  deleteState,
  createNewState,
  getState,
  getFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  postFunFact,
  patchFunFact,
  deleteFunFact
};
