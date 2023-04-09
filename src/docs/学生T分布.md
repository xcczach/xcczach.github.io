# 学生T分布
## 公式 自由度$\gamma$
$$T_\gamma=\frac{Z}{\sqrt{X_\gamma^2/\gamma}}$$
$Z$为标准正态变量，$X_\gamma^2$为*独立*卡方变量，自由度$\gamma$。
## 概率密度函数
$$f_{T_\gamma}=\frac{\Gamma(\frac{\gamma+1}{2})}{\Gamma(\frac{\gamma}{2})\sqrt{\pi \gamma}}(1+\frac{t^2}{\gamma})^{-\frac{\gamma+1}{2}}$$
## 分布模型：未知$\mu$和未知$\sigma^2$的正态分布
$$T_{n-1}=\frac{\overline X-\mu}{\frac{S}{\sqrt{n}}}$$
样本平均$\overline X$,样本标准差$S$，样本数量$n$
# 非中心学生T分布
## 公式 自由度$\gamma$
$$T_\gamma=\frac{Z+\mu}{\sqrt{X_\gamma^2/\gamma}}$$
$Z$为标准正态变量，$X_\gamma^2$为*独立*卡方变量，自由度$\gamma$，非中心参数$\mu\ne 0$。
## 概率密度函数（之一）
$$f(x)=\frac{\gamma^{\frac{\gamma}{2}}e^{-\frac{\gamma\mu^2}{2(x^2+\gamma)}}}{\sqrt{\pi}\Gamma(\frac{\gamma}{2})2^{\frac{v-1}{2}}(x^2+\gamma)^{\frac{v+1}{2}}}\int_0^\infty{t^\gamma e^{-\frac{1}{2}(t-\frac{\mu x}{\sqrt{x^2+\gamma}})^2}dt}$$
