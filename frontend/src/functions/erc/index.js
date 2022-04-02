import Web3 from 'web3'
import MintTicket from '../../contract/MintTicket.json'
import SaleTicket from '../../contract/SaleTicket.json'
import ERC20 from '../../contract/ERC20.json'

export const web3 = new Web3(process.env.REACT_APP_BLOCK_CHAIN_NODE_URL)

export const MINT_ABI = MintTicket.abi
export const MINT_BYTE_CODE = MintTicket.bytecode

export const SALE_ABI = SaleTicket.abi
export const SALE_BYTE_CODE = SaleTicket.bytecode

export const ADMIN = process.env.REACT_APP_ADMIN_WALLET_ADDRESS
export const ADMIN_PK = process.env.REACT_APP_ADMIN_PRIVATE_KEY
export const ERC20ADDRESS = process.env.REACT_APP_ERC20_ADDRESS

export const ERC20_ABI = ERC20.abi
export const SSAFY_CONTRACT_ADDRESS = process.env.REACT_APP_ERC20_ADDRESS