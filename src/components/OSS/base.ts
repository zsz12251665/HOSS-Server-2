type Dictionary<T> = { [key: string]: T }

interface Result {
	url: string,
	token: string
}

abstract class BaseOSS {
	/**
	 * 签发上传文件令牌
	 * @param {string} identifier 文件标识符
	 * @returns {Result} 上传文件目标
	 */
	abstract upload(identifier: string): Promise<Result>;

	/**
	 * 签发下载文件令牌
	 * @param {string} identifier 文件标识符
	 * @returns {Result} 下载文件目标
	 */
	abstract download(identifier: string): Promise<Result>;

	/**
	 * 删除文件
	 * @param {string} identifier 文件标识符
	 */
	abstract remove(identifier: string): Promise<void>;

	/**
	 * 打包文件
	 * @param {Dictionary<string>} identifiers 文件标识符字典（文件标识符为键，文件名为值）
	 * @example archive({ 'identifiers/foo': 'foo.filename', 'identifiers/bar': 'bar.filename' })
	 * @returns {Result} 打包文件目标
	 */
	abstract archive(identifiers: Dictionary<string>): Promise<Result>;
}

export default BaseOSS
