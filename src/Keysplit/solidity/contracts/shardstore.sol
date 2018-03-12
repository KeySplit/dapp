pragma solidity ^0.4.18;

contract ShardStore {

    event StorageConfirmed(
        address trustedContact,
        uint indexed shardId
    );

    function confirmStorage(uint[] shardId) public {
        for(uint i = 0; i < shardId.length; i++){
            StorageConfirmed(msg.sender, shardId[i]);
        }
    }

    /* FUTURE WORK FOR EVALUATION
    - Do we want to create a mapping of addresses that are allowed
    to call confirmStorage? Right now a small attack vector exists
    where a malicious actor could confirm storage of a particular
    shardId even though the true user is not confirming that and may
    no longer have the ID.
    */
    /*
    - I think a better approach is for the client side to track which address
    has previously confirmed an address and alert the user if a new address
    claims the address. On the client side, the user can elect to trust or
    distrust new adresses that are trying to confirm their shard ids - similar
    to how the Signal messenger alerts users when their contacts safety numbers
    change.

    That said, I think being able to trust multiple addresses to confirm a
    shard needs to be out of scope for the next 11 hours of the hackathon.
    */
}
