/**
 * 基于 crypto 的哈希函数
 * @module hash
 */

const { createHash } = require('crypto');

/**
 * 哈希函数
 * @param {string | Buffer | TypedArray | DataView} content 要计算哈希的内容
 * @param {string} algorithm 使用的哈希算法
 * @param {string} encoding 返回值的编码
 * @returns {string} 计算出的哈希值
 */
module.exports = function (content, algorithm = 'sha256', encoding = 'hex') {
	const hash = createHash(algorithm);
	hash.update(content);
	return hash.digest(encoding);
};
