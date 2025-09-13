// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReportVerification {
    mapping(string => uint256) private reportTimestamps;
    
    event ReportStored(string indexed reportHash, uint256 timestamp);
    
    function storeReport(string memory _reportHash) public {
        require(reportTimestamps[_reportHash] == 0, "Report already stored");
        reportTimestamps[_reportHash] = block.timestamp;
        emit ReportStored(_reportHash, block.timestamp);
    }
    
    function verifyReport(string memory _reportHash) public view returns (uint256) {
        return reportTimestamps[_reportHash];
    }
}