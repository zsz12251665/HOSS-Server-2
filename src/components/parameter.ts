import Parameter, { ParameterRules, ValidateError } from 'parameter'

export { ParameterRules as Rules } from 'parameter'

interface Dictionary<T> { [key: string]: T }

type Callback<T> = (errors: T) => any

const parameter = new Parameter()

export class ValidationError extends Error {
	rules: ParameterRules
	data: any
	errors: ValidateError[] | Dictionary<ValidateError[]>

	constructor(rules: ParameterRules, data: any, errors: ValidateError[] | Dictionary<ValidateError[]>) {
		super('Parameter validation failed!')
		this.rules = rules
		this.data = data
		this.errors = errors
	}
}

/**
 * 验证表单数据
 * @param {ParameterRules} rules 表单验证规则
 * @param {any} data 表单数据
 * @throws {ValidationError} 表单错误
 */
export function validate(rules: ParameterRules, data: any): void;
/**
 * 验证表单数据
 * @param {ParameterRules} rules 表单验证规则
 * @param {any} data 表单数据
 * @param {'throw'} callback 抛出错误
 * @throws {ValidationError} 表单错误
 */
export function validate(rules: ParameterRules, data: any, callback: 'throw'): void;
/**
 * 验证表单数据
 * @param {ParameterRules} rules 表单验证规则
 * @param {any} data 表单数据
 * @param {'return'} callback 返回错误
 * @return {undefined | ValidateError[]} 表单错误
 */
export function validate(rules: ParameterRules, data: any, callback: 'return'): undefined | ValidateError[];
/**
 * 验证表单数据
 * @param {ParameterRules} rules 表单验证规则
 * @param {any} data 表单数据
 * @param {Callback<ValidateError[]>} callback 错误回调函数
 */
export function validate(rules: ParameterRules, data: any, callback: Callback<ValidateError[]>): void;
export function validate(rules: ParameterRules, data: any, callback: 'throw' | 'return' | Callback<ValidateError[]> = 'throw'): void | ValidateError[] {
	const errors = parameter.validate(rules, Object.assign({}, data))
	if (errors) {
		if (callback === 'throw')
			throw new ValidationError(rules, data, errors)
		else if (callback === 'return')
			return errors
		else
			callback(errors)
	}
}

/**
 * 验证表单字典
 * @param {ParameterRules} rules 表单验证规则
 * @param {Dictionary<any>} data 表单字典
 * @throws {ValidationError} 表单错误
 */
export function validateDictionary(rules: ParameterRules, data: Dictionary<any>): void;
 /**
  * 验证表单字典
  * @param {ParameterRules} rules 表单验证规则
  * @param {Dictionary<any>} data 表单字典
  * @param {'throw'} callback 抛出错误
  * @throws {ValidationError} 表单错误
  */
export function validateDictionary(rules: ParameterRules, data: Dictionary<any>, callback: 'throw'): void;
 /**
  * 验证表单字典
  * @param {ParameterRules} rules 表单验证规则
  * @param {Dictionary<any>} data 表单字典
  * @param {'return'} callback 返回错误
  * @return {undefined | Dictionary<ValidateError[]>} 表单错误
  */
export function validateDictionary(rules: ParameterRules, data: Dictionary<any>, callback: 'return'): undefined | Dictionary<ValidateError[]>;
 /**
  * 验证表单字典
  * @param {ParameterRules} rules 表单验证规则
  * @param {Dictionary<any>} data 表单字典
  * @param {Callback<Dictionary<ValidateError[]>>} callback 错误回调函数
  */
export function validateDictionary(rules: ParameterRules, data: Dictionary<any>, callback: Callback<Dictionary<ValidateError[]>>): void;
export function validateDictionary(rules: ParameterRules, data: Dictionary<any>, callback: 'throw' | 'return' | Callback<Dictionary<ValidateError[]>> = 'throw'): void | Dictionary<ValidateError[]> {
	const errorsDictionary: Dictionary<ValidateError[]> = {}
	for (const key in data)
		validate(rules, data[key], (errors) => errorsDictionary[key] = errors)
	if (Object.keys(errorsDictionary).length) {
		if (callback === 'throw')
			throw new ValidationError(rules, data, errorsDictionary)
		else if (callback === 'return')
			return errorsDictionary
		else
			callback(errorsDictionary)
	}
}
