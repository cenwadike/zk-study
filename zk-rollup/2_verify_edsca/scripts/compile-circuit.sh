#!/bin/bash

cd circuits

echo "Compiling circuit.circom..."

# compile circuit
circom circuit.circom --r1cs --wasm --sym -o .

snarkjs r1cs info circuit.r1cs


echo "Start Power of Tau ceremony..."

# start power of tau ceremony 
snarkjs powersoftau new bn128 14 powersOfTau28_hez_final_10.ptau -v

echo "First contribution for Power of Tau ceremony..."

# contribute to power of tau
snarkjs powersoftau contribute powersOfTau28_hez_final_10.ptau powersOfTau28_hez_final_10.ptau --name="First contribution" -v

echo "Second contribution for Power of Tau ceremony..."
# second contribution
snarkjs powersoftau contribute powersOfTau28_hez_final_10.ptau powersOfTau28_hez_final_10.ptau --name="Second contribution" -v -e="some random text"

echo "Third contribution for Power of Tau ceremony..."
# third contribution
snarkjs powersoftau export challenge powersOfTau28_hez_final_10.ptau challenge_0003
snarkjs powersoftau challenge contribute bn128 challenge_0003 response_0003 -e="some random text"
snarkjs powersoftau import response powersOfTau28_hez_final_10.ptau response_0003 powersOfTau28_hez_final_10.ptau -n="Third contribution name"

echo "Verify okay..."
# verify everything is okay 
snarkjs powersoftau verify powersOfTau28_hez_final_10.ptau

cd ..