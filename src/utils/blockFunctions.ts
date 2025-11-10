import {
    Contract,
    formatEther,
    formatUnits,
    parseEther,
    JsonRpcSigner,
    JsonRpcProvider
} from "ethers";
import {
    FactoryAbi,
    TokenAbi,

} from "@/config/abi";
import { FACTORY_CONTRACT, TOKEN_CONTRACT } from "@/config/contracts";
import { notifyError, notifySuccess, notifyInfo } from "./notify";
const RPC_URLS = {
    'base-sepolia': 'https://sepolia.base.org',
    'base': 'https://mainnet.base.org',
    'ethereum': 'https://eth.llamarpc.com',
    'sepolia': 'https://rpc.sepolia.org',
};
import { formatAddress } from "./connectWallet"


const provider = new JsonRpcProvider(RPC_URLS['base']);


export async function approveToken(
    amount: string | number,
    signer: JsonRpcSigner,
    address: string
) {
    try {
        const TOKEN = new Contract(TOKEN_CONTRACT, TokenAbi, signer);
        const amountInWei = parseEther(amount.toString());
        const allowance = await TOKEN.allowance(address, FACTORY_CONTRACT);

        if (allowance.toString() >= amountInWei) {
            return true;
        }
        notifyInfo("Approving token..., please wait and confirm the transaction in your wallet.");

        const tx = await TOKEN.approve(FACTORY_CONTRACT, amountInWei);
        const reciept = await tx.wait();

        return reciept;
    } catch (error: unknown) {
        console.log(error);
        let errorMessage = "An unknown error occurred.";

        if (
            typeof error === "object" &&
            error !== null &&
            "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message === "string"
        ) {
            errorMessage = (error as { data: { message: string } }).data.message;
        } else if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: string }).message === "string"
        ) {
            errorMessage = (error as { message: string }).message;
        }

        errorMessage =
            errorMessage.length > 150
                ? `${errorMessage.slice(0, 150)}...`
                : errorMessage;

        notifyError(errorMessage);
        throw new Error(errorMessage);
    }
}
export async function applyGrants(
    signer: JsonRpcSigner,
    projectName: string,
    tokenCA: string,
    description: string,
    purpose: string,
    requestedAmount: number,
    depositRequired: number,
    website: string,
    twitter: string,
    telegram: string,
    farcaster: string
) {

    const Factory = new Contract(FACTORY_CONTRACT, FactoryAbi, signer);
    try {
        const application = {
            projectName: projectName,
            tokenCA: tokenCA,
            description: description,
            purpose: purpose,
            requestedAmount: parseEther(requestedAmount.toString()),
            depositRequired: parseEther(depositRequired.toString()),
            socials: {
                website: website,
                twitter: twitter,
                telegram: telegram,
                farcaster: farcaster
            }
        }
        const tnx = await Factory.applyForGrant(application)
        const receipt = await tnx.wait();

        notifySuccess(`Transaction was sent sucessfully ${receipt.hash}`);
        return receipt;

    } catch (error: unknown) {
        console.log(error);
        let errorMessage = "An unknown error occurred.";

        if (
            typeof error === "object" &&
            error !== null &&
            "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message === "string"
        ) {
            errorMessage = (error as { data: { message: string } }).data.message;
        } else if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: string }).message === "string"
        ) {
            errorMessage = (error as { message: string }).message;
        }

        errorMessage =
            errorMessage.length > 150
                ? `${errorMessage.slice(0, 150)}...`
                : errorMessage;

        notifyError(errorMessage);
        throw new Error(errorMessage);
    }

}
export async function voteOnGrant(
    signer: JsonRpcSigner,
    grantId: number,
    voteAmount: number
) {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, signer);

    try {
        const tx = await GrantDAO.vote(grantId, parseEther(voteAmount.toString()));
        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.hash
        };
    } catch (error) {
        // Error handling similar to applyGrants
        throw error;
    }
}

export async function depositForGrant(
    signer: JsonRpcSigner,
    grantId: number,
    depositAmount: number // in tokens (7% of supply)
) {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, signer);

    try {
        const tx = await GrantDAO.depositSupplyForGrant(
            grantId,
            parseEther(depositAmount.toString())
        );
        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.hash
        };
    } catch (error) {
        throw error;
    }
}

export async function stakeTokens(
    signer: JsonRpcSigner,
    stakeAmount: number // in tokens
) {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, signer);

    try {
        const tx = await GrantDAO.stake(parseEther(stakeAmount.toString()));
        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.hash
        };
    } catch (error) {
        throw error;
    }
}

export async function unstakeTokens(
    signer: JsonRpcSigner,
    unstakeAmount: number // in tokens
) {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, signer);

    try {
        const tx = await GrantDAO.unstake(parseEther(unstakeAmount.toString()));
        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.hash
        };
    } catch (error) {
        throw error;
    }
}

export async function fetchUserTokenBalance(
    signer: JsonRpcSigner,
    address: string
) {
    const TokenContract = new Contract(TOKEN_CONTRACT, TokenAbi, signer);
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, signer);


    try {
        const tokenStaked = await GrantDAO.stakers(address);
        const balance = await TokenContract.balanceOf(address);

        const formattedBalance = formatUnits(balance, 18);
        const fomatToken = formatUnits(tokenStaked[0], 18)

        return { formattedBalance, fomatToken };

    } catch (error) {
        throw error;
    }
}



// Helper function to format Wei to Ether
const formatWeiToEther = (weiAmount: bigint | string): string => {
    try {
        return formatEther(weiAmount.toString());
    } catch (error) {
        console.error("Error formatting Wei to Ether:", error);
        return "0";
    }
};

// Helper function to format timestamp to readable date
const formatTimestamp = (timestamp: bigint | number): string => {
    try {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return "N/A";
    }
};

// Helper function to calculate time remaining
const getTimeRemaining = (votingEndsAt: bigint | number): string => {
    try {
        const endTime = Number(votingEndsAt) * 1000;
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) return "Ended";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    } catch (error) {
        return "N/A";
    }
};

// Map status enum to readable string
const getStatusString = (status: number): string => {
    const statusMap: Record<number, string> = {
        0: 'pending',
        1: 'voting',
        2: 'approved',
        3: 'rejected',
        4: 'completed',
        5: 'cancelled'
    };
    return statusMap[status] || 'unknown';
};

interface ContractGrant {
    id: bigint;
    applicant: string;
    projectName: string;
    tokenCA: string;
    description: string;
    purpose: string;
    requestedAmount: bigint;
    votes: bigint;
    status: number;
    depositRequired: bigint;
    createdAt: bigint;
    votingEndsAt: bigint;
    deposited: boolean;
    disbursed: boolean;
    socials: {
        website: string;
        twitter: string;
        telegram: string;
        farcaster: string;
    };
}

// Formatted Grant Interface
export interface FormattedGrant {
    id: string | number;
    applicant: string;
    projectName: string;
    tokenCA: string;
    description: string;
    purpose: string;
    requestedAmount: string; // in Ether
    requestedAmountRaw: string; // raw Wei value
    votes: string; // in Ether
    votesRaw: string; // raw Wei value
    status: string;
    statusCode: number;
    depositRequired: string; // in Ether
    depositRequiredRaw: string; // raw Wei value
    createdAt: string; // formatted date
    createdAtTimestamp: number; // Unix timestamp
    votingEndsAt: string; // formatted date
    votingEndsAtTimestamp: number; // Unix timestamp
    timeRemaining: string; // human readable
    deposited: boolean;
    disbursed: boolean;
    socials: {
        website: string;
        twitter: string;
        telegram: string;
        farcaster: string;
    };
}

export function formatNumber(value: number | string): string {
    // Convert to number if string
    const num = typeof value === 'string' ? parseFloat(value) : value;

    // Handle invalid numbers
    if (isNaN(num)) return '0';

    // Handle billions
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B';
    }

    // Handle millions
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    }

    // Handle thousands
    if (num >= 1_000) {
        return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    }

    // Handle regular numbers with commas
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Alternative version with more control over decimals
export function formatNumberAdvanced(
    value: number | string,
    options?: {
        decimals?: number;
        showK?: boolean;
    }
): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const decimals = options?.decimals ?? 2;
    const showK = options?.showK ?? true;

    if (isNaN(num)) return '0';

    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(decimals).replace(/\.?0+$/, '') + 'B';
    }

    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(decimals).replace(/\.?0+$/, '') + 'M';
    }

    if (showK && num >= 1_000) {
        return (num / 1_000).toFixed(decimals).replace(/\.?0+$/, '') + 'K';
    }

    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    });
}

export async function getGrants(): Promise<FormattedGrant[]> {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, provider);

    try {
        const grants = await GrantDAO.getAllGrants();

        // Format and destructure each grant
        const formattedGrants: FormattedGrant[] = grants.map((grant: ContractGrant) => {
            // Destructure the grant object
            const {
                id,
                applicant,
                projectName,
                tokenCA,
                description,
                purpose,
                requestedAmount,
                votes,
                status,
                depositRequired,
                createdAt,
                votingEndsAt,
                deposited,
                disbursed,
                socials
            } = grant;

            // Format all the data
            return {
                id: id.toString(),
                applicant: applicant,
                projectName: projectName,
                tokenCA: formatAddress(tokenCA),
                description: description,
                purpose: purpose,

                // Format amounts from Wei to Ether
                requestedAmount: formatWeiToEther(requestedAmount),
                requestedAmountRaw: requestedAmount.toString(),

                votes: formatWeiToEther(votes),
                votesRaw: votes.toString(),

                depositRequired: formatWeiToEther(depositRequired),
                depositRequiredRaw: depositRequired.toString(),

                // Format status
                status: getStatusString(Number(status)),
                statusCode: Number(status),

                // Format timestamps
                createdAt: formatTimestamp(createdAt),
                createdAtTimestamp: Number(createdAt),

                votingEndsAt: formatTimestamp(votingEndsAt),
                votingEndsAtTimestamp: Number(votingEndsAt),
                timeRemaining: getTimeRemaining(votingEndsAt),

                // Booleans
                deposited: deposited,
                disbursed: disbursed,

                // Socials
                socials: {
                    website: socials.website || '',
                    twitter: socials.twitter || '',
                    telegram: socials.telegram || '',
                    farcaster: socials.farcaster || ''
                }
            };
        });

        return formattedGrants;

    } catch (error) {
        console.error("Error fetching grants:", error);
        throw error;
    }
}


// Helper to filter grants by status
export async function getGrantsByStatus(status: 'pending' | 'voting' | 'approved' | 'rejected' | 'completed' | 'cancelled'): Promise<FormattedGrant[]> {
    try {
        const allGrants = await getGrants();
        return allGrants.filter(grant => grant.status === status);
    } catch (error) {
        console.error("Error filtering grants by status:", error);
        throw error;
    }
}

// Helper to get active voting grants
export async function getActiveVotingGrants(): Promise<FormattedGrant[]> {
    try {
        const allGrants = await getGrants();
        return allGrants.filter(grant =>
            grant.status === 'voting' &&
            grant.timeRemaining !== 'Ended'
        );
    } catch (error) {
        console.error("Error fetching active voting grants:", error);
        throw error;
    }
}

export async function TopStakers() {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, provider);

    try {
        const [addresses, amounts] = await GrantDAO.getTopStakers();

        return addresses.map((address: string, index: number) => ({
            address: formatAddress(address),
            amount: formatUnits(amounts[index].toString()),
            rank: index + 1
        }));
    } catch (error) {
        throw error;
    }
}
export async function getTotalStaked() {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, provider);

    try {
        const totalStaked = await GrantDAO.totalStaked();
        const totalvalue = formatUnits(totalStaked.toString())
        return totalvalue.toString();
    } catch (error) {
        console.error("Error fetching total staked:", error);
        throw error;
    }
}
export async function isUserVoted(grantId: number, userAddress: string) {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, provider);

    try {
        const hasVoted = await GrantDAO.hasUserVoted(grantId, userAddress);
        return hasVoted;
    } catch (error) {
        console.error("Error checking vote status:", error);
        throw error;
    }
}
export async function getTreasuryBalance() {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, provider);

    try {
        const balanceETH = await GrantDAO.treasuryBalanceETH();
        return balanceETH.toString();
    } catch (error) {
        console.error("Error fetching treasury balance:", error);
        throw error;
    }
}

export async function getContractCapConstants() {
    const GrantDAO = new Contract(FACTORY_CONTRACT, FactoryAbi, provider);

    try {
        const minVote = await GrantDAO.MIN_VOTE_FEE();
        const maxVote = await GrantDAO.MAX_VOTE_FEE();
        const voteCap = await GrantDAO.MAX_VOTE_CAP();

        const minVoteValue = formatUnits(minVote.toString())
        const maxVoteValue = formatUnits(maxVote.toString())
        const voteCapValue = formatUnits(voteCap.toString())


        return {
            minVoteValue,
            maxVoteValue,
            voteCapValue
        }
    } catch (error) {
        console.error("Error fetching treasury balance:", error);
        throw error;
    }
}


export async function fetchSevenPercentage(
    tokenCA: string
): Promise<number> {
    try {
        const TOKEN = new Contract(tokenCA, TokenAbi, provider);
        const supply = await TOKEN.totalSupply();

        const totalSupply = parseFloat(formatUnits(supply, 18));
        const sevenPerc = (totalSupply * 7) / 100;

        return sevenPerc;
    } catch (error) {
        console.error("Error fetching seven percent:", error);
        throw error;
    }
}

export async function getEthBalanceInUSDT(
  address: string
): Promise<{ balanceETH: string; balanceUSDT: string }> {
  try {
    // 1) Fetch ETH balance (in wei)
    const balanceWei = await provider.getBalance(address);

    const balanceETH = formatEther(balanceWei);

    // 3) Fetch ETH price in USD from CoinGecko API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    if (!response.ok) {
      throw new Error(`CoinGecko price fetch failed: ${response.status}`);
    }
    const priceJson = await response.json();
    const ethPriceUSD = priceJson.ethereum.usd;
    if (typeof ethPriceUSD !== "number") {
      throw new Error("Invalid price data from CoinGecko");
    }

    // 4) Calculate balance in USDT (1 USDT ≈ 1 USD)
    const balanceUSDT = (parseFloat(balanceETH) * ethPriceUSD).toFixed(2);

    return {
      balanceETH,
      balanceUSDT,
    };
  } catch (error) {
    console.error("Error in getEthBalanceInUSDT:", error);
    throw error;
  }
}