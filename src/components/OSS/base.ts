import { PathLike } from 'fs'
import { Readable, Writable } from 'stream'

abstract class BaseOSS {
	/**
	 * 列举已存在的文件标识符
	 * @returns {string[]} 文件标识符列表
	 */
	abstract list(): Promise<string[]>;

	/**
	 * 上传文件
	 * @param {string} identifier 文件标识符
	 * @param {PathLike} path 文件路径
	 */
	abstract upload(identifier: string, path: PathLike): Promise<void>;
	/**
	 * 上传文件
	 * @param {string} identifier 文件标识符
	 * @param {Readable} file 文件输入流
	 */
	abstract upload(identifier: string, file: Readable): Promise<void>;

	/**
	 * 下载文件
	 * @param {string} identifier 文件标识符
	 * @param {PathLike} path 文件路径
	 */
	abstract download(identifier: string, path: PathLike): Promise<void>;
	/**
	 * 下载文件
	 * @param {string} identifier 文件标识符
	 * @param {Writable} file 文件输出流
	 */
	abstract download(identifier: string, file: Writable): Promise<void>;
	/**
	 * 下载文件
	 * @param {string} identifier 文件标识符
	 * @returns {Readable} 文件输入流
	 */
	abstract download(identifier: string): Promise<Readable>;

	/**
	 * 判断文件是否存在
	 * @param {string} identifier 文件标识符
	 * @returns {boolean} 文件是否存在
	 */
	 abstract contains(identifier: string): Promise<boolean>;

	 /**
	  * 删除文件
	  * @param {string} identifier 文件标识符
	  */
	 abstract remove(identifier: string): Promise<void>;
}

export default BaseOSS
