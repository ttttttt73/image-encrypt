pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
    
    string public content;
    string public sign;

    event Send(string _content, string _sign);

    function set(string memory x, string memory y) public {
        content = x;
        sign = y;
        emit Send(content, sign);
    }

    function get() public view returns (string memory, string memory) {
        return (content, sign);
    }

    /*function kill() public onlyOwner() {
        selfdesturct(owner);
    }*/
}