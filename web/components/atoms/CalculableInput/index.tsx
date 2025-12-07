'use client';

import React, { useState, useEffect, KeyboardEvent, FocusEvent } from 'react';
import { Input } from '../Input';

interface CalculableInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
    onNextFocus?: () => void;
    onPrevFocus?: () => void;
}

export const CalculableInput: React.FC<CalculableInputProps> = ({
    value,
    onChange,
    onNextFocus,
    onPrevFocus,
    ...props
}) => {
    // 内部でローカルな値を保持し、フォーカスが外れるまでonChangeを呼ばない...
    // いや、要件的には「Inputエリアの各フォーカスが移動するたびに計算結果を更新すること」＝リアルタイム性？
    // しかし数式入力中にリアルタイム更新すると "10+" とかでエラーになる。
    // 「フォーカスが移動する際に計算され」とあるので、BlurまたはEnter確定で親に通知する形が良い。

    const [localValue, setLocalValue] = useState(value);

    // 親からのvalue変更を反映
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const calculate = (input: string): string => {
        if (!input) return '';

        // 使用可能文字チェック: 数字, 演算子(+, -, *, /, (, )), ドット, スペース
        if (!/^[0-9+\-*/().\s]+$/.test(input)) {
            return '0';
        }

        try {
            // Functionコンストラクターで計算 (eval相当だが、上記のRegexチェックで安全性を担保)
            const result = new Function(`return (${input})`)();

            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
                return '0';
            }

            // マイナスは0
            if (result < 0) return '0';

            // 小数点切り捨て (Math.floor)
            return Math.floor(result).toString();
        } catch {
            return '0';
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const calculated = calculate(localValue);
        // 値が変わった場合のみ通知してもいいが、整形のため常に通知する方が無難か
        onChange(calculated);
        setLocalValue(calculated);

        if (props.onBlur) props.onBlur(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Form submit防止など
            const calculated = calculate(localValue);
            onChange(calculated);
            setLocalValue(calculated);

            if (onNextFocus) onNextFocus();
        } else if (e.key === 'Tab') {
            // Tabはデフォルト挙動でBlurが走るので、ここでは計算はBlurに任せても良いが
            // Requirement: "TABキーまたはENTERキーで次の項目にフォーカスが移動する際に計算され"
            // Shift+Tabのサポート
            if (e.shiftKey) {
                if (onPrevFocus) {
                    // e.preventDefault(); // ここで止めるとフォーカス移動しないかも？
                    // Blurが走るので計算はされる。Focus制御は親任せか、ここで行うか。
                    // 今回はBlurで計算確定するので、ここでは特になにもしなくてよいはず。
                }
            } else {
                if (onNextFocus) {
                    // 同上
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            // 現在の値を計算してから+1
            const current = calculate(localValue);
            const nextVal = (parseInt(current || '0', 10) + 1).toString();
            onChange(nextVal);
            setLocalValue(nextVal);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const current = calculate(localValue);
            const nextVal = Math.max(0, parseInt(current || '0', 10) - 1).toString();
            onChange(nextVal);
            setLocalValue(nextVal);
        }

        if (props.onKeyDown) props.onKeyDown(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    return (
        <Input
            {...props}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
};
