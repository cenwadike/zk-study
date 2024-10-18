# [assignment] create your own bash script to compile Multiplier3.circom using PLONK below
#!/bin/bash

# [assignment] create your own bash script to compile Multiplier3.circom modeling after compile-HelloWorld.sh below
#!/bin/bash

cd contracts/circuits

mkdir Multiplier3Plonk

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Multiplier3.circom..."

# compile circuit
circom Multiplier3.circom --r1cs --wasm --sym -o Multiplier3Plonk
snarkjs r1cs info Multiplier3Plonk/Multiplier3.r1cs

# generate witness
node Multiplier3Plonk/Multiplier3_js/generate_witness.js Multiplier3Plonk/Multiplier3_js/Multiplier3.wasm Multiplier3Plonk/input.json Multiplier3Plonk/Multiplier3_js/witness.wtns

# Start a new zkey 
snarkjs plonk setup Multiplier3Plonk/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3Plonk/circuit_final.zkey

# export verificatio key
echo "Exporting the verification key"
snarkjs zkey export verificationkey Multiplier3Plonk/circuit_final.zkey Multiplier3Plonk/verification_key.json

# generate proof
echo "Generating zk-proof"
snarkjs plonk prove Multiplier3Plonk/circuit_final.zkey Multiplier3Plonk/Multiplier3_js/witness.wtns proof.json public.json

# Verify the proof
echo "Verifying the proof"
snarkjs plonk verify Multiplier3Plonk/verification_key.json public.json proof.json

# generate solidity contract
snarkjs zkey export solidityverifier Multiplier3Plonk/circuit_final.zkey ../Multiplier3PlonkVerifier.sol

cd ../..