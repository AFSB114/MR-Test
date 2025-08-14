"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, History } from "lucide-react"

interface HistoryItem {
  id: string
  expression: string
  result: string
  timestamp: Date
}

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(display)
    } else if (operation) {
      const currentValue = previousValue || "0"
      const newValue = calculate(Number.parseFloat(currentValue), inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const currentValue = Number.parseFloat(previousValue)
      const result = calculate(currentValue, inputValue, operation)
      const expression = `${previousValue} ${operation} ${display}`

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: String(result),
        timestamp: new Date(),
      }

      setHistory((prev) => [historyItem, ...prev].slice(0, 20)) // Keep last 20 calculations

      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const buttonClass = "h-14 text-lg font-semibold"
  const operatorClass = "h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
  const equalsClass = "h-14 text-lg font-semibold bg-green-600 text-white hover:bg-green-700"

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          {/* Display */}
          <div className="bg-muted p-4 rounded-lg mb-4">
            <div className="text-right text-3xl font-mono font-bold text-foreground min-h-[2.5rem] flex items-center justify-end">
              {display}
            </div>
            {operation && previousValue && (
              <div className="text-right text-sm text-muted-foreground mt-1">
                {previousValue} {operation}
              </div>
            )}
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button variant="outline" className={buttonClass} onClick={clear}>
              AC
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4" />
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputOperation("÷")}>
              ÷
            </Button>
            <Button className={operatorClass} onClick={() => inputOperation("×")}>
              ×
            </Button>

            {/* Row 2 */}
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("7")}>
              7
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("8")}>
              8
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("9")}>
              9
            </Button>
            <Button className={operatorClass} onClick={() => inputOperation("-")}>
              -
            </Button>

            {/* Row 3 */}
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("4")}>
              4
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("5")}>
              5
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("6")}>
              6
            </Button>
            <Button className={operatorClass} onClick={() => inputOperation("+")}>
              +
            </Button>

            {/* Row 4 */}
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("1")}>
              1
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("2")}>
              2
            </Button>
            <Button variant="outline" className={buttonClass} onClick={() => inputNumber("3")}>
              3
            </Button>
            <Button className={equalsClass} rowSpan={2} onClick={performCalculation}>
              =
            </Button>

            {/* Row 5 */}
            <Button
              variant="outline"
              className="col-span-2 h-14 text-lg font-semibold bg-transparent"
              onClick={() => inputNumber("0")}
            >
              0
            </Button>
            <Button variant="outline" className={buttonClass} onClick={inputDecimal}>
              .
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Panel */}
      {showHistory && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">History</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No calculations yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => {
                        setDisplay(item.result)
                        setPreviousValue(null)
                        setOperation(null)
                        setWaitingForOperand(true)
                      }}
                    >
                      <div className="text-sm text-muted-foreground">{item.expression}</div>
                      <div className="font-mono font-semibold">{item.result}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.timestamp.toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
