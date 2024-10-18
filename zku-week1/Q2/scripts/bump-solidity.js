const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Groth16Verifier/

let helloContent = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let helloBumped = helloContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
helloBumped = helloBumped.replace(verifierRegex, 'contract HelloWorldVerifier');
fs.writeFileSync("./contracts/HelloWorldVerifier.sol", helloBumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

const Groth16Regex = /contract Groth16Verifier/

let Multiplier3VerifierContent = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
let Multiplier3VerifierBumped = Multiplier3VerifierContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
Multiplier3VerifierBumped = Multiplier3VerifierBumped.replace(Groth16Regex, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", Multiplier3VerifierBumped);


const PlonkRegex = /contract Multiplier3Verifier /

let Multiplier3PlonkVerifierContent = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
let Multiplier3PlonkVerifierBumped = Multiplier3PlonkVerifierContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
Multiplier3PlonkVerifierBumped = Multiplier3PlonkVerifierBumped.replace(PlonkRegex, 'contract Multiplier3PlonkVerifier');

fs.writeFileSync("./contracts/Multiplier3PlonkVerifier.sol", Multiplier3PlonkVerifierBumped);
