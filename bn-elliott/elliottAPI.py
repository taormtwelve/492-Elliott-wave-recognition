from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import yfinance as yf
from enchant.utils import levenshtein # pip install pyenchant
from pyts.approximation import SymbolicAggregateApproximation # pip install pyts

stocks = ('ADVANC', 'AIT', 'DELTA', 'DTAC', 'FORTH', 'HANA', 'HUMAN', 'ILINK', 'INET', 'JAS'
          , 'JMART', 'KCE', 'MFEC', 'NEX', 'SAMART', 'SIS', 'SVOA', 'TEAM', 'TRUE')
elliott_wave = ['Impulse', 'Diagonal', 'Flat', 'ZigZag', 'Triangle']
historical = [[] for _ in range(len(stocks))]
hl_sax = [[] for _ in range(len(stocks))]
SC = [[] for _ in range(len(elliott_wave))]

def String_representation(X, n_bins = 8):
    
    # normalization
    X_norm = [(Xi - Xi.mean())/Xi.std() for Xi in X]
    
    # Symbolic Aggregate Approximation
    S = []
    sax = SymbolicAggregateApproximation(n_bins=n_bins, strategy='normal')
    for xs in X_norm:
        S.append(''.join(sax.fit_transform([xs])[0]))
    return S.copy()

# get multiprototype
file = open('multiprototype_Elliott.csv')
data = file.read().split()
data = [d.split(',') for d in data]
for d in data:
    SC[int(d[0])].append(d[1])


# get stocks historical and SAX
for stock_id in range(len(stocks)):
    pattern, hl_pattern = [], []
    file = open('.\Data\\' + stocks[stock_id] +'_Elliott.csv')
    data = file.read().split()
    data = [d.split(',') for d in data]
    for i, ds in enumerate(data):
        if len(ds) == 2:
            if not pattern == [] and len(pattern) > 20:
                historical[stock_id].append(pattern)
                hl_sax[stock_id].append(String_representation([np.array(hl_pattern)])[0])
            pattern, hl_pattern = [], []
            # _y = int(ds[1]) - 1

        elif i == len(data) - 1:
            historical[stock_id].append(pattern)
            hl_sax[stock_id].append(String_representation([np.array(hl_pattern)])[0])
            pattern, hl_pattern = [], []

        else:
            # File Header : [Date, Open, High, Low, Close, Adj Close, Volume]
            pattern.append(ds[:5])
            hl_pattern.append(float(ds[2]))
            hl_pattern.append(float(ds[3]))



def FKNN(SC, S_pred, K = 3, m = 2):
    pred = []
    for _s in S_pred:
        
        # lowest levenshtein distance K prototypes
        lowest = []
        Lev = [[levenshtein(_s, sc_ij) for sc_ij in sc_i] for sc_i in SC]
        for _ in range(K):
            lev_min = float('inf')
            lev_class, lev_idx = -1, -1
            for i in range(len(Lev)):
                for j in range(len(Lev[i])):
                    if Lev[i][j] < lev_min:
                        lev_min = Lev[i][j]
                        lev_class = i
                        lev_idx = j
            lowest.append((lev_class, lev_idx))
            Lev[lev_class][lev_idx] = float('inf')

        # class prediction
        prob = []
        for _k in range(K):
            dividend, divisor = 0, 0
            for (i, j) in lowest:
                lev = levenshtein(SC[i][j], _s)
                if not lev == 0:
                    eq = (1/lev)**(1/(m-1))
                else:
                    eq = 1
                
                divisor += eq
                if lowest[_k][0] == i:
                    dividend += eq
            prob.append(dividend/divisor)
        pred.append(lowest[np.array(prob).argmax()][0])            
    return pred

app = Flask(__name__)
cors = CORS(app)
def qouteTicker(name):
    qoute = yf.Ticker(name)
    chg = qoute.info['regularMarketPrice'] - qoute.info['regularMarketPreviousClose']
    data = {
        "name": name.replace('.BK',''),
        "price": qoute.info['regularMarketPrice'],
        "per_chg": chg*100/qoute.info['regularMarketPreviousClose'],
        "bid": qoute.info['bid'],
        "ask": qoute.info['ask'],
        "vol": qoute.info['volume']
    }
    return data

@app.route('/setindex', methods=['GET'])
def getSETIndexTickData():
    qoute = yf.Ticker("^SET.BK")
    chg = qoute.info['regularMarketPrice'] - qoute.info['regularMarketPreviousClose']
    data = {
        "index": qoute.info['regularMarketPrice'],
        "chg":  chg,
        "per_chg": chg*100/qoute.info['regularMarketPreviousClose'],
        "O": qoute.info['regularMarketOpen'],
        "H": qoute.info['regularMarketDayHigh'],
        "L": qoute.info['regularMarketDayLow'],
        "vol": qoute.info['volume']
    }
    return jsonify({"setindex":data}),200

@app.route('/ticker/<path:path>', methods=['GET'])
def stockTicker(path):
    name = path.upper()
    data = qouteTicker(name)
    return jsonify({"stock":data}),200

@app.route('/quote/<path:quote>/<path:id>', methods=['GET'])
def stockQuote(quote, id):
    name = quote.upper()
    try:
        idx = int(id)
    except:
        idx = 0
    if idx < 0:
        idx = 0
    if idx >= len(historical[stocks.index(name)]):
        idx = len(historical[stocks.index(name)])
    
    data = historical[stocks.index(name)][idx]
    return jsonify({"historical":data, "idx":idx}),200

@app.route('/predict/<path:quote>/<path:id>', methods=['GET'])
def predictPattern(quote, id):
    pred_idx = FKNN(SC, [hl_sax[stocks.index(quote)][int(id)]])
    pred = elliott_wave[pred_idx[0]]
    return jsonify({"predict":pred}),200

if __name__ == "__main__":
    app.run(debug=True)
