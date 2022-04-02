import { ERC20_ABI, SSAFY_CONTRACT_ADDRESS } from './index'

//spender에게 owner의 토큰 중 얼만큼의 권한이 있는지
export async function allowance(web3, owner, spender) {
  const contractInstance = new web3.eth.Contract(ERC20_ABI, SSAFY_CONTRACT_ADDRESS)
  const transactionInstance = contractInstance.methods.allowance(owner, spender)
  const response = await transactionInstance.call()

  return response
}
