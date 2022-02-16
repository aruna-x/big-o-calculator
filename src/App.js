// Libraries
import React, { useState } from 'react';
import styled from 'styled-components';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { esprima, escodegen, estraverse, getBigO } from './modules/calculator'

function App() {

    const [result, setResult] = useState({
        error: "none",
        bigOEst: "",
        hotLines: []
    });

    // Seed function
    function binarySearch(arr) {
        let left = 0, right = arr.length-1;
        while (left<=right) {
          let middle = Math.floor((right-left)/2) + left;
          if (arr[middle] === 30) {
            return middle
          }
          else if (arr[middle] < 30) {
            right = middle - 1;
          }
          else {
            right = middle + 1;
          }
        }
    }
    const ast = esprima.parse(`${binarySearch}`);
    const code = escodegen.generate(ast);

    const [codeSubmit, setCodeSubmit] = useState(code);
    const [dataType, setDataType] = useState("integer");

    function handleSubmit() {
        const {error, bigOEst, hotLines} = getBigO(dataType, codeSubmit);
        setResult({error: error, bigOEst: bigOEst, hotLines: hotLines});
    }

    return (
        <PageStyle>
            <h1>Big O Calculator</h1>
            <EditorContainer>
                <Editor
                    value={codeSubmit}
                    onValueChange={code => setCodeSubmit(code)}
                    highlight={codeSubmit => highlight(codeSubmit, languages.js)}
                    padding={20}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 17,
                        background: 'rgb(245,245,245)',
                        minHeight: 200,
                        maxWidth: 650,
                        margin: 'auto auto',
                        overflow: 'auto',
                    }}
                />
            </EditorContainer>

            <DataTypeContainer>
                <label>Input data type:</label>
                <Select id="dataType" name="dataType" value={dataType} onChange={(e)=>setDataType(e.target.value)}>
                    <option value="integer">int, e.g. 55</option>
                    <option value="array-ints">array of ints, e.g. [3, 2, 77]</option>
                    <option value="string">random string, e.g. StRiNgNoNums</option>
                    <option value="array-strs">array of strings, e.g. ['aa', 'ab', 'ac']</option>
                    
                    {/* <option value="alpha-num-str">alpha-numeric string</option> */}
                    {/* <option value="alpha-num-spec-str">alpha-numeric and special character string</option> */}
                    {/* <option value="array-rand-str">array of random strings</option> */}
                </Select>
                <Button onClick={handleSubmit}>SUBMIT</Button>
            </DataTypeContainer>

            <FlexContainer>
                <ResContainer>
                    <h3>Big O Estimate:</h3>
                    <p>{result.bigOEst === "" ? null : result.bigOEst}</p>
                </ResContainer>
                <ResContainer>
                    <h3>Hot Lines:</h3>
                    <p>{result.hotLines === [] ? null : result.hotLines[0]}</p>
                </ResContainer>
            </FlexContainer>
            <p>{result.error === "none" ? null : result.error}</p>
            <br/>
            <h5><em>JavaScript support only</em></h5>
            <h6><em>Able to compute O(1), O(log(n)), O(n), O(n^2). Pending: O(nlog(n)) and O(n^1/2).</em></h6>
            <h5><em>Read about the technology that makes this app possible: <a href="https://dev.to/aruna/abstract-syntax-trees-theyre-used-everywhere-but-what-are-they-jh6">Abstract Syntax Trees (ASTs)</a></em></h5>
            
        </PageStyle>
    );
}

export default App;

const PageStyle = styled.div`
    margin-top: 50px;
    text-align: center;
    font-family: Fira code,Fira Mono,Consolas,Menlo,Courier,monospace;
`

const EditorContainer = styled.div`
    margin-top: 40px;
    max-height: 400px;
    overflow: auto;
`

const DataTypeContainer = styled.div`
    margin-top: 20px;
`

const FlexContainer = styled.div`
    display: flex;
    max-width: 600px;
    margin: 50px auto 0 auto;
    justify-content: space-evenly;
    border: 1px solid rgba(0,0,0,.2);
    padding: 20px;
`

const ResContainer = styled.div`
    min-height: 125px;
`

const Select = styled.select`
    font-family: Fira code,Fira Mono,Consolas,Menlo,Courier,monospace;
    margin-left: 10px;
    margin-right: 30px;
    padding: 5px;
    border: 1px solid rgba(0,0,0,.2);
`

const Button = styled.button`
    font-family: Fira code,Fira Mono,Consolas,Menlo,Courier,monospace;
    padding: 5px;
    border: 1px solid rgba(0,0,0,.2);
`