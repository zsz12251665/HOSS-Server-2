import { BinaryLike, BinaryToTextEncoding, createHash } from 'crypto'

/**
 * 哈希函数
 * @param {BinaryLike} content 要计算哈希值的内容
 * @param {string} algorithm 使用的哈希算法
 * @param {BinaryToTextEncoding} encoding 返回值的编码
 * @returns {string} 计算出的哈希值
 */
export function hash(content: BinaryLike, algorithm: string = 'sha256', encoding: BinaryToTextEncoding = 'hex'): string {
	return createHash(algorithm).update(content).digest(encoding)
}

export default hash
