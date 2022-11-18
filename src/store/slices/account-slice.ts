import { ethers } from 'ethers';
// import { getAddresses } from '../../constants';
import { setAll } from '../../helpers';

import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from '@ethersproject/providers';

import { Networks } from '../../constants/blockchain';
import { RootState } from '../store';

// interface IGetBalances {
//   address: string;
//   networkID: Networks;
//   provider: StaticJsonRpcProvider | JsonRpcProvider;
// }

// interface IAccountBalances {
//   balances: {
//     betTest: string;
//   };
// }

// export const getBalances = createAsyncThunk(
//   'account/getBalances',
//   async ({
//     address,
//     networkID,
//     provider,
//   }: IGetBalances): Promise<IAccountBalances> => {
//     const addresses = getAddresses(networkID);

//     const betTestContract = new ethers.Contract(
//       addresses.BETEST_ADDRESS,
//       BetTestTokenContract,
//       provider
//     );
//     const betTestBalance = await betTestContract.balanceOf(address);

//     return {
//       balances: {
//         betTest: ethers.utils.formatUnits(betTestBalance, 'gwei'),
//       },
//     };
//   }
// );

interface ILoadAccountDetails {
  address: string;
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
  balances: {
    ATHENA: string;
  };
}

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({
    networkID,
    provider,
    address,
  }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let athenaBalance = 0;

    // const addresses = getAddresses(networkID);

    // if (addresses.BETEST_ADDRESS) {
    //   const betTestContract = new ethers.Contract(
    //     addresses.BETEST_ADDRESS,
    //     BetTestTokenContract,
    //     provider
    //   );
    //   betTestBalance = await betTestContract.balanceOf(address);
    // }

    return {
      balances: {
        ATHENA: ethers.utils.formatUnits(athenaBalance, 'ether'),
      },
    };
  }
);

export interface IUserTokenDetails {
  allowance: number;
  balance: number;
  isAvax?: boolean;
}

export interface IAccountSlice {
  balances: {
    betTest: string;
  };
  loading: boolean;
  tokens: { [key: string]: IUserTokenDetails };
  bets: any;
  accountbets: any;
}

const initialState: IAccountSlice = {
  loading: true,
  balances: { betTest: '' },
  tokens: {},
  bets: [],
  accountbets: [],
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, (account) => account);
