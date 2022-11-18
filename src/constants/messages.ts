export const messages = {
  please_connect:
    'Please connect your wallet to the Cronos network to use CronoSports.',
  please_connect_wallet: 'Please connect your wallet.',
  try_mint_more: (value: string) =>
    `You're trying to mint more than the maximum payout available! The maximum mint payout is ${value} BETIFY.`,
  before_minting: 'Before minting, enter a value.',
  existing_mint:
    'You have an existing mint. Minting will reset your vesting period and forfeit any pending claimable rewards. We recommend claiming rewards first or using a fresh wallet. Do you still wish to proceed?',
  exiting_warmup:
    'By exiting the warmup period before end of 3 rebases, you will lose your warmup rewards.',
  before_stake: 'Before staking, enter a value.',
  before_unstake: 'Before un staking, enter a value.',
  tx_successfully_send: 'Your transaction was successfully sent',
  your_balance_updated: 'Your balance was successfully updated',
  nothing_to_claim: 'You have nothing to claim',
  something_wrong: 'Something went wrong',
  switch_to_avalanche: 'Switch to the BSC  network?',
  slippage_too_small: 'Slippage too small',
  slippage_too_big: 'Slippage too big',
  your_balance_update_soon: 'Your balance will update soon',
  before_wrap: 'Before wrapping, enter a value.',
  before_unwrap: 'Before un wrapping, enter a value.',
  insufficiant_balance: 'You have insufficiant balance',
  error: 'Error! Please try again',
  stack_success: 'Staked Successfully',
  select_bet: 'Please Select Bet First',
  unstack_success: 'UnStaked Successfully',
  approve_success: 'Approved Successfully',
  claim_success: 'Claimed Successfully',
  minimum_bet: (value: string, token: string) =>
    `Minimum bet amount should be more than  ${value} ${token}.`,
};
