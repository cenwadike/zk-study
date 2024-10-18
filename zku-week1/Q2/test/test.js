const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { groth16, plonk } = require("snarkjs");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

describe("HelloWorld", function () {
    this.timeout(100000000);
    let Verifier;
    let verifier;

    beforeEach(async function () {
        // deploy HelloVerifier contract
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Circuit should multiply two numbers correctly", async function () {
        // instance of hello circom contract
        const circuit = await wasm_tester("contracts/circuits/HelloWorld.circom");

        // input used to compute witness
        const INPUT = {
            "a": 2,
            "b": 3
        }

        // compute witness and get witness value
        const witness = await circuit.calculateWitness(INPUT, true);
        // console.log(witness);

        // check witness match witness value
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(6)));
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // generate proof and public signal (ie output signal)
        const { proof, publicSignals } = await groth16.fullProve({"a":"2","b":"3"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        // print out output signal
        // console.log('2x3 =',publicSignals[0]);
        
        // Construct the raw calldata to be sent to the verifier contract 
        // ie. proofA, proofB, proofC and input
        const calldata = await groth16.exportSolidityCallData(proof, publicSignals);
    
        // split calldata into individual components
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // verify proof
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {

    this.timeout(100000000);
    let Verifier;
    let verifier;

    beforeEach(async function () {
        // deploy Multiplier3Verifier contract
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Circuit should multiply three numbers correctly", async function () {
        //[assignment] insert your script here
        // instance of hello circom contract
        const circuit = await wasm_tester("contracts/circuits/Multiplier3.circom");

        // input used to compute witness
        const INPUT = {
            "a": 2,
            "b": 3,
            "c": 4
        }

        // compute witness and get witness value
        const witness = await circuit.calculateWitness(INPUT, true);
        // console.log("witnes: ", witness);

        // check witness match witness value
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(24)));
        assert(Fr.eq(Fr.e(witness[2]),Fr.e(2)));
        assert(Fr.eq(Fr.e(witness[3]),Fr.e(3)));
        assert(Fr.eq(Fr.e(witness[4]),Fr.e(4)));
        assert(Fr.eq(Fr.e(witness[5]),Fr.e(6)));
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // generate proof and public signal (ie output signal)
        const { proof, publicSignals } = await groth16.fullProve(
            {"a":"2","b":"3","c":"4"}, 
            "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
            "contracts/circuits/Multiplier3/circuit_final.zkey"
        );

        // print out output signal
        // console.log('2x3x4 =',publicSignals[0]);
        
        // Construct the raw calldata to be sent to the verifier contract 
        // ie. proofA, proofB, proofC and input
        const calldata = await groth16.exportSolidityCallData(proof, publicSignals);
    
        // split calldata into individual components
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // verify proof
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    this.timeout(100000000);
    let Verifier;
    let verifier;

    beforeEach(async function () {
        // deploy Multiplier3VerifierPlonk circom verifier contract
        Verifier = await ethers.getContractFactory("Multiplier3PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
    });
    
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
    });
});